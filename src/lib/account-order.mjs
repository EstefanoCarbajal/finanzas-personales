export async function saveAccountOrder(pool, userId, ids) {
  if (!Array.isArray(ids) || ids.length > 10000 || ids.some(id => typeof id !== 'string' || id.length !== 36) || new Set(ids).size !== ids.length) {
    throw new Error('El orden de cuentas no es válido.');
  }
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [accounts] = await connection.execute('SELECT id FROM accounts WHERE user_id = ? FOR UPDATE', [userId]);
    const owned = new Set(accounts.map(account => account.id));
    if (ids.length !== owned.size || ids.some(id => !owned.has(id))) throw new Error('Las cuentas cambiaron. Actualiza la página e inténtalo de nuevo.');
    for (const [position, id] of ids.entries()) {
      await connection.execute('UPDATE accounts SET sort_order = ? WHERE user_id = ? AND id = ?', [position, userId, id]);
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally { connection.release(); }
}
