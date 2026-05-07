import { ExportDataset } from './build-export-dataset';

export function exportToCsv(dataset: ExportDataset): string {
  const { rawTransactions } = dataset;
  const rows: string[][] = [];

  // Headers
  rows.push(['Date', 'Wallet', 'Category', 'Type', 'Amount', 'Note']);

  // Data
  rawTransactions.forEach(t => {
    rows.push([
      new Date(t.transaction_date).toISOString().split('T')[0],
      t.wallet_name || 'Main Wallet',
      t.category_name || 'Uncategorized',
      t.type,
      t.amount.toString(),
      `"${(t.note || '').replace(/"/g, '""')}"` // Escape quotes for CSV
    ]);
  });

  return rows.map(r => r.join(',')).join('\n');
}
