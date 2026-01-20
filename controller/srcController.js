const { importExcel, exportToExcel } = require('../service/srcService');
const fs = require('fs');

const uploadAndValidate = async (req, res) => {
  try {
    console.log("[NODE] Upload request received");

    if (!req.file) {
      console.error("[NODE] No file uploaded");
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("[NODE] File received:", req.file.originalname);
    console.log("[NODE] Passing file to Excel service");

 
    const validatedData = await importExcel(req.file.path);

    console.log("[NODE] Excel service completed");

 
    fs.unlinkSync(req.file.path);
    console.log("[NODE] Uploaded file removed from disk");

    if (!validatedData || validatedData.length === 0) {
      console.error("[NODE] No data returned from Excel service");
      return res.status(400).json({ error: "No data to export" });
    }

    console.log("[NODE] Preparing Excel export");
    console.log("[NODE] Total rows:", validatedData.length);

    const buffer = exportToExcel(validatedData);

    console.log("[NODE] Excel export ready, sending response");

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=validated_data.xlsx'
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    res.send(buffer);

    console.log("[NODE] Response sent successfully");

  } catch (error) {
    console.error("[NODE] FATAL ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadAndValidate };
