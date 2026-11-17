import ExcelJS from 'exceljs';

/** Text cells are explicitly strings, never formulas; money becomes numeric only for Excel output. */
export async function movementsExcel(movements) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Movimientos', { views: [{ state: 'frozen', ySplit: 1 }] });
  sheet.columns = [
    { header: 'Fecha', key: 'date', width: 15 },
    { header: 'Descripción', key: 'description', width: 42 },
    { header: 'Cuenta', key: 'account', width: 25 },
    { header: 'Categoría o destino', key: 'category', width: 25 },
    { header: 'Tipo', key: 'kind', width: 22 },
    { header: 'Moneda', key: 'currency', width: 12 },
    { header: 'Importe', key: 'amount', width: 20 },
  ];
  const labels = { income: 'Ingreso', expense: 'Gasto', transfer: 'Transferencia' };
  for (const m of movements) sheet.addRow({ date: String(m.occurred_on), description: String(m.description), account: String(m.account_name), category: String(m.destination_name || m.category_name || ''), kind: m.kind === 'transfer' && m.destination_type === 'credit' ? 'Pago de tarjeta' : labels[m.kind] || String(m.kind), currency: m.currency || 'PEN', amount: Number(m.amount) });
  sheet.getColumn('amount').numFmt = '#,##0.00';
  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF23483C' } };
  sheet.getRow(1).height = 25;
  sheet.autoFilter = { from: 'A1', to: `G${sheet.rowCount}` };
  return workbook.xlsx.writeBuffer();
}
