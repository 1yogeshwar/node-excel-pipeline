const XLSX = require("xlsx");
const { processCalculation } = require("../service/calculationService");

exports.importExcel = async (filePath) => {
  console.log("[NODE] Reading Excel file");

  const workbook = XLSX.readFile(filePath);
  console.log("[NODE] Workbook loaded");

  const sheetName = workbook.SheetNames[0];
  console.log("[NODE] Sheet found:", sheetName);

  const sheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: false  });
  console.log("[NODE] Total rows found:", rows.length);

  const headers = rows[0];
  console.log("[NODE] Headers read:", headers);

  const expectedHeaders = ["Num1", "Num2"];

  const isValidHeaders =
    headers.length === expectedHeaders.length &&
    headers.every((h, i) => h === expectedHeaders[i]);

  if (!isValidHeaders) {
    console.error("[NODE] Header validation FAILED");
    throw new Error("Invalid Excel headers. Expected Num1, Num2");
  }

  console.log("[NODE] Header validation SUCCESS");

  const dataRows = rows.slice(1);
  const processedData = [];


const BATCH_SIZE = 10;

for (let i = 0; i < dataRows.length; i = BATCH_SIZE + i) {
  const batch = dataRows.slice(i, i + BATCH_SIZE);
  const batchStartRow = i + 2;
  const batchEndRow =  dataRows.length-1;

  console.log(
    `\n[NODE] Processing batch (${batchStartRow}–${batchEndRow})`
  );

  let batchSuccess = 0;
  let batchFailed = 0;
  const batchErrors = [];

  for (let j = 0; j < batch.length; j++) {
    const excelRow = batchStartRow + j;
    const row = batch[j];

    try {
      const sum = await processCalculation(row[0], row[1]);

      processedData.push({
        // row: excelRow,
        Num1: row[0],
        Num2: row[1],
        Sum: sum,
        // status: "SUCCESS"
      });

      batchSuccess++;
    } catch (err) {
      processedData.push({
        // row: excelRow,
        Num1: row[0],
        Num2: row[1],
        Sum: null,
        // status: "FAILED",
        error: err.toString()
      });

      batchFailed++;
      batchErrors.push(`Row ${excelRow}: ${err}`);
    }
  }
  
  console.log(
    `[NODE] Batch (${batchStartRow}–${batchEndRow}) completed → success=${batchSuccess}, failed=${batchFailed}`
  );

  if (batchErrors.length > 0) {
    console.warn(
      `[NODE] Batch errors:\n - ${batchErrors.join("\n - ")}`
    );
  }
}
  return processedData;
};

exports.exportToExcel = (processedData) => {
  const worksheet = XLSX.utils.json_to_sheet(processedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Result");
  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
};
