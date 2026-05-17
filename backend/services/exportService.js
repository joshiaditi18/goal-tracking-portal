const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');

const exportCsv = (data, fields) => {
  const parser = new Parser({ fields });
  return parser.parse(data);
};

const exportExcel = async (data, columns) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Report');

  sheet.columns = columns.map((col) => ({ header: col.label, key: col.key, width: col.width || 20 }));
  sheet.addRows(data);

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

module.exports = { exportCsv, exportExcel };
