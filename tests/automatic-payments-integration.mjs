import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import env from '@next/env';
import { createDatabasePool } from '../src/lib/database.mjs';
import { schedulePayment, processAutomaticPayments, cancelPayment, settlePayment } from '../src/lib/planning.mjs';
env.loadEnvConfig(process.cwd());
if (process.env.DB_NAME !== 'u519053982_finanzas_test' || process.env.TEST_DB_NAME !== process.env.DB_NAME || process.env.DB_SSL !== 'true') throw Error('Solo pruebas con TLS y destino confirmado');
test('automatic payments: concurrency, cancellation, isolation, catch-up and currency', async () => {
  const pool=createDatabasePool(), user=randomUUID(), foreign=randomUUID(), account=randomUUID(), category=randomUUID();
  try {
    for(const id of [user,foreign]) await pool.execute('INSERT INTO users (id,email,password_hash) VALUES (?,?,?)',[id,`auto-${id}@example.invalid`,'not-a-login']);
    await pool.execute("INSERT INTO accounts (id,user_id,name,currency) VALUES (?,?,?,'USD')",[account,user,'QA automática']);
    await pool.execute("INSERT INTO categories (id,user_id,name,kind) VALUES (?,?,?,'expense')",[category,user,'QA pagos']);
    const tomorrow=new Date(Date.now()+86400000).toISOString().slice(0,10);
    const input={account_id:account,category_id:category,description:'QA programado',amount:'25.75',due_on:tomorrow,payment_mode:'automatic',automatic_time:'23:59'};
    await assert.rejects(schedulePayment(pool,foreign,input));
    await schedulePayment(pool,user,input);
    let [[payment]]=await pool.execute('SELECT id FROM scheduled_payments WHERE user_id=?',[user]);
    await processAutomaticPayments(pool,user);
    let [[count]]=await pool.execute('SELECT COUNT(*) AS n FROM movements WHERE user_id=?',[user]);assert.equal(Number(count.n),0);
    await assert.rejects(settlePayment(pool,foreign,payment.id));
    // Simulate an overdue job belonging only to this disposable fixture.
    await pool.execute("UPDATE scheduled_payments SET automatic_at=DATE_SUB(UTC_TIMESTAMP(),INTERVAL 1 DAY),due_on='2026-01-02' WHERE id=? AND user_id=?",[payment.id,user]);
    const results=await Promise.all([processAutomaticPayments(pool,user),processAutomaticPayments(pool,user)]);assert.ok(results.every(r=>r.failed===0));
    const [rows]=await pool.execute('SELECT amount,currency,occurred_on FROM movements WHERE user_id=?',[user]);
    assert.equal(rows.length,1);assert.equal(rows[0].amount,'25.75');assert.equal(rows[0].currency,'USD');assert.equal(rows[0].occurred_on,'2026-01-02');
    await assert.rejects(settlePayment(pool,user,payment.id));
    await schedulePayment(pool,user,{...input,description:'QA cancelar'});
    const [[cancel]]=await pool.execute("SELECT id FROM scheduled_payments WHERE user_id=? AND status='scheduled'",[user]);
    await cancelPayment(pool,user,cancel.id);
    await pool.execute('UPDATE scheduled_payments SET automatic_at=DATE_SUB(UTC_TIMESTAMP(),INTERVAL 1 DAY) WHERE id=? AND user_id=?',[cancel.id,user]);
    await processAutomaticPayments(pool,user);
    [[count]]=await pool.execute('SELECT COUNT(*) AS n FROM movements WHERE user_id=?',[user]);assert.equal(Number(count.n),1);
    await schedulePayment(pool,user,{...input,payment_mode:'manual',description:'QA manual'});
    const [[manual]]=await pool.execute("SELECT id FROM scheduled_payments WHERE user_id=? AND status='scheduled'",[user]);
    await settlePayment(pool,user,manual.id);
    [[count]]=await pool.execute('SELECT COUNT(*) AS n FROM movements WHERE user_id=?',[user]);assert.equal(Number(count.n),2);
  } finally {
    for(const table of ['scheduled_payments','movements','categories','accounts']) await pool.execute(`DELETE FROM ${table} WHERE user_id=?`,[user]);
    for(const id of [user,foreign]) await pool.execute('DELETE FROM users WHERE id=?',[id]);
    await pool.end();
  }
});
