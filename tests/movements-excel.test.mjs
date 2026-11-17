import test from 'node:test';
import assert from 'node:assert/strict';
import ExcelJS from 'exceljs';
import { movementsExcel } from '../src/lib/movements-excel.mjs';

test('Excel export roundtrips text safely, numeric amounts, currency and selected rows', async () => {
  const descriptions = ['=1+1', '+SUM(A1)', '@test', '-test', 'Café & té'];
  const bytes = await movementsExcel(descriptions.map((description, i) => ({ description, occurred_on: '2026-11-16', account_name: 'Mi cuenta', kind: i ? 'expense' : 'transfer', destination_type: i ? null : 'credit', destination_name: i ? null : 'Visa', category_name: 'Ocio', amount: i ? '10.25' : '99999999999.99', currency: 'USD' })));
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(bytes);
  const sheet = workbook.getWorksheet('Movimientos');
  assert.equal(sheet.rowCount, 6);
  descriptions.forEach((value, i) => { assert.equal(sheet.getCell(`B${i + 2}`).value, value); assert.equal(sheet.getCell(`B${i + 2}`).type, ExcelJS.ValueType.String); });
  assert.equal(sheet.getCell('A2').value, '2026-11-16');
  assert.equal(sheet.getCell('E2').value, 'Pago de tarjeta');
  assert.equal(sheet.getCell('F2').value, 'USD');
  assert.equal(sheet.getCell('G3').value, 10.25);
  assert.equal(sheet.getCell('G2').value.toFixed(2), '99999999999.99');
  assert.equal(sheet.getCell('G3').numFmt, '#,##0.00');
});
