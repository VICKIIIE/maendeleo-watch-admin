import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const normalizeCellValue = (value) => {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toLocaleString();
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

export const generatePDF = (title, columns, data, filename) => {
  const doc = new jsPDF('p', 'mm', 'a4');

  doc.setFontSize(18);
  doc.text(title, 14, 22);

  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

  const tableHeaders = columns.map((column) => column.header);
  const tableRows = data.map((item) => columns.map((column) => {
    const rawValue = typeof column.format === 'function' ? column.format(item) : item[column.key];
    return normalizeCellValue(rawValue);
  }));

  autoTable(doc, {
    startY: 35,
    head: [tableHeaders],
    body: tableRows,
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 2,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [17, 94, 89],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  doc.save(`${filename}.pdf`);
};