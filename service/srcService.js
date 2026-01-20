const XLSX = require("xlsx");
const { processCalculation } = require("../service/calculationService");

exports.importExcel = async (filePath) => {
  console.log("[NODE] Reading Excel file");

  const workbook = XLSX.readFile(filePath);
  console.log("[NODE] Workbook loaded");

  const sheetName = workbook.SheetNames[0];
  console.log("[NODE] Sheet found:", sheetName);

  const sheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
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

  for (let i = 0; i < dataRows.length; i++) {
    const excelRow = i + 2;
    const row = dataRows[i];

    console.log(`\n[NODE] Processing Row ${excelRow}`);

    const rowData = {};
    headers.forEach((header, idx) => {
      rowData[header] = row[idx];
    });

    console.log(
      `[NODE] Row ${excelRow} values → Num1=${rowData.Num1}, Num2=${rowData.Num2}`
    );

    try {
      console.log(`[NODE] Row ${excelRow} → Sending to Python`);

      const sum = await processCalculation(rowData.Num1, rowData.Num2);

      console.log(
        `[NODE] Row ${excelRow} SUCCESS → Sum=${sum}`
      );

      processedData.push({
        // row: excelRow,
        Num1: rowData.Num1,
        Num2: rowData.Num2,
        Sum: sum,
        // status: "SUCCESS"
      });

    } catch (err) {
      console.error(
        `[NODE] Row ${excelRow} FAILED → ${err}`
      );

      processedData.push({
        // row: excelRow,
        Num1: rowData.Num1,
        Num2: rowData.Num2,
        Sum: null,
        // status: "FAILED",
        error: err.toString()
      });
    }
  }

  console.log("\n[NODE] Processing completed");
  console.log("[NODE] Total processed rows:", processedData.length);

  return processedData;
};

exports.exportToExcel = (processedData) => {
  const worksheet = XLSX.utils.json_to_sheet(processedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Result");
  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
};
