import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { ExportDataset } from './build-export-dataset';

type AutoTableDocument = jsPDF & {
  lastAutoTable?: {
    finalY?: number;
  };
};

export interface PdfExportLabels {
  title: string;
  period: string;
  exportedOn: string;
  financialSummary: string;
  description: string;
  amount: string;
  totalIncome: string;
  totalExpense: string;
  netBalance: string;
  expenseByCategory: string;
  category: string;
  transactionDetails: string;
  date: string;
  type: string;
  note: string;
  uncategorized: string;
  typeIncome: string;
  typeExpense: string;
  typeTransfer: string;
}

interface PdfExportOptions {
  labels: PdfExportLabels;
  formatAmount: (value: number) => string;
  normalizeText?: (value: string) => string;
  renderAsImage?: boolean;
}

function appendText(parent: HTMLElement, tagName: keyof HTMLElementTagNameMap, text: string, className?: string) {
  const element = document.createElement(tagName);
  element.textContent = text;
  if (className) {
    element.className = className;
  }
  parent.appendChild(element);
  return element;
}

function appendTable(parent: HTMLElement, headers: string[], rows: string[][]) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');

  headers.forEach((header) => {
    appendText(headRow, 'th', header);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  rows.forEach((row) => {
    const tableRow = document.createElement('tr');
    row.forEach((cell) => {
      appendText(tableRow, 'td', cell);
    });
    tbody.appendChild(tableRow);
  });
  table.appendChild(tbody);
  parent.appendChild(table);
}

function buildImageReportPages(
  dataset: ExportDataset,
  locale: string,
  labels: PdfExportLabels,
  formatAmount: (value: number) => string,
) {
  const { range, cashflow, expensesByCategory, rawTransactions } = dataset;
  const formatDate = (ms: number) => new Date(ms).toLocaleDateString(locale);
  const formatType = (type: string) => {
    if (type === 'income') return labels.typeIncome;
    if (type === 'expense') return labels.typeExpense;
    if (type === 'transfer') return labels.typeTransfer;
    return type;
  };

  const pages: HTMLElement[] = [];
  const createPage = () => {
    const page = document.createElement('div');
    page.style.cssText = [
      'width:794px',
      'min-height:1123px',
      'box-sizing:border-box',
      'padding:48px',
      'background:#ffffff',
      'color:#111827',
      'font-family:Arial,Helvetica,sans-serif',
      'font-size:14px',
      'line-height:1.4',
    ].join(';');
    return page;
  };

  const firstPage = createPage();
  appendText(firstPage, 'h1', labels.title).style.cssText =
    'margin:0 0 8px;font-size:28px;line-height:1.2;color:#111827';
  appendText(
    firstPage,
    'p',
    `${labels.period}: ${formatDate(range.startDate)} - ${formatDate(range.endDate)}`,
  ).style.cssText = 'margin:0;color:#4b5563';
  appendText(firstPage, 'p', `${labels.exportedOn}: ${new Date().toLocaleString(locale)}`).style.cssText =
    'margin:2px 0 28px;color:#4b5563';

  appendText(firstPage, 'h2', labels.financialSummary).style.cssText =
    'margin:0 0 10px;font-size:20px;color:#111827';
  appendTable(firstPage, [labels.description, labels.amount], [
    [labels.totalIncome, formatAmount(cashflow.totalIncome)],
    [labels.totalExpense, formatAmount(cashflow.totalExpense)],
    [labels.netBalance, formatAmount(cashflow.netAmount)],
  ]);

  appendText(firstPage, 'h2', labels.expenseByCategory).style.cssText =
    'margin:28px 0 10px;font-size:20px;color:#111827';
  appendTable(
    firstPage,
    [labels.category, labels.amount],
    expensesByCategory.map((category) => [category.category_name, formatAmount(category.amount)]),
  );
  pages.push(firstPage);

  const transactionRows = rawTransactions.map((transaction) => [
    formatDate(transaction.transaction_date),
    transaction.category_name || labels.uncategorized,
    formatType(transaction.type),
    formatAmount(transaction.amount),
    transaction.note || '-',
  ]);

  for (let index = 0; index < Math.max(transactionRows.length, 1); index += 24) {
    const page = createPage();
    appendText(page, 'h2', labels.transactionDetails).style.cssText =
      'margin:0 0 12px;font-size:22px;color:#111827';
    appendTable(
      page,
      [labels.date, labels.category, labels.type, labels.amount, labels.note],
      transactionRows.slice(index, index + 24),
    );
    pages.push(page);
  }

  pages.forEach((page) => {
    page.querySelectorAll('table').forEach((table) => {
      (table as HTMLElement).style.cssText =
        'width:100%;border-collapse:collapse;margin:0 0 8px;table-layout:fixed';
    });
    page.querySelectorAll('th').forEach((cell) => {
      (cell as HTMLElement).style.cssText =
        'padding:9px 8px;border:1px solid #d1d5db;background:#0ea5e9;color:#ffffff;text-align:left;font-weight:700;word-break:break-word';
    });
    page.querySelectorAll('td').forEach((cell) => {
      (cell as HTMLElement).style.cssText =
        'padding:8px;border:1px solid #e5e7eb;vertical-align:top;word-break:break-word';
    });
  });

  return pages;
}

async function exportImagePdf(
  dataset: ExportDataset,
  locale: string,
  labels: PdfExportLabels,
  formatAmount: (value: number) => string,
) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const { default: html2canvas } = await import('html2canvas');
  const pages = buildImageReportPages(dataset, locale, labels, formatAmount);
  const container = document.createElement('div');
  container.style.cssText = 'position:absolute;left:-10000px;top:0;background:#ffffff';
  document.body.appendChild(container);

  try {
    for (let index = 0; index < pages.length; index += 1) {
      const page = pages[index];
      container.appendChild(page);
      const canvas = await html2canvas(page, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
      });
      if (index > 0) {
        doc.addPage();
      }
      doc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
      container.removeChild(page);
    }
  } finally {
    document.body.removeChild(container);
  }

  return doc.output('datauristring');
}

export async function exportToPdf(
  dataset: ExportDataset,
  locale: string,
  options: PdfExportOptions,
): Promise<string> {
  if (options.renderAsImage) {
    return exportImagePdf(dataset, locale, options.labels, options.formatAmount);
  }

  const doc = new jsPDF();
  const tableDoc = doc as AutoTableDocument;
  const { range, cashflow, expensesByCategory, rawTransactions } = dataset;
  const { labels, formatAmount, normalizeText = (value) => value } = options;

  const formatDate = (ms: number) => new Date(ms).toLocaleDateString(locale);
  const text = (value: string | number) => normalizeText(String(value));
  const formatType = (type: string) => {
    if (type === 'income') return labels.typeIncome;
    if (type === 'expense') return labels.typeExpense;
    if (type === 'transfer') return labels.typeTransfer;
    return type;
  };

  // Header
  doc.setFontSize(22);
  doc.text(text(labels.title), 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(text(`${labels.period}: ${formatDate(range.startDate)} - ${formatDate(range.endDate)}`), 14, 30);
  doc.text(text(`${labels.exportedOn}: ${new Date().toLocaleString(locale)}`), 14, 35);

  // Cashflow Summary
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.text(text(labels.financialSummary), 14, 50);
  
  autoTable(doc, {
    startY: 55,
    head: [[text(labels.description), text(labels.amount)]],
    body: [
      [text(labels.totalIncome), text(formatAmount(cashflow.totalIncome))],
      [text(labels.totalExpense), text(formatAmount(cashflow.totalExpense))],
      [text(labels.netBalance), text(formatAmount(cashflow.netAmount))],
    ],
    theme: 'striped',
    headStyles: { fillColor: [14, 165, 233] },
  });

  // Categories
  const currentY = (tableDoc.lastAutoTable?.finalY ?? 55) + 15;
  doc.text(text(labels.expenseByCategory), 14, currentY);
  
  autoTable(doc, {
    startY: currentY + 5,
    head: [[text(labels.category), text(labels.amount)]],
    body: expensesByCategory.map(c => [text(c.category_name), text(formatAmount(c.amount))]),
    theme: 'grid',
    headStyles: { fillColor: [244, 63, 94] },
  });

  // Transactions (Detailed)
  doc.addPage();
  doc.text(text(labels.transactionDetails), 14, 20);
  
  autoTable(doc, {
    startY: 25,
    head: [[text(labels.date), text(labels.category), text(labels.type), text(labels.amount), text(labels.note)]],
    body: rawTransactions.map(t => [
      text(formatDate(t.transaction_date)),
      text(t.category_name || labels.uncategorized),
      text(formatType(t.type)),
      text(formatAmount(t.amount)),
      text(t.note || '-')
    ]),
    headStyles: { fillColor: [71, 85, 105] },
    columnStyles: {
      4: { cellWidth: 50 } // Note column wrap
    }
  });

  return doc.output('datauristring');
}
