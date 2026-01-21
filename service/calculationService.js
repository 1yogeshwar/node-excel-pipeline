const { spawn } = require("child_process");

exports.processCalculation = (a, b) => {
  return new Promise((resolve, reject) => {
    const python = spawn("python3", [
      "-u",
      "script.py",
      a,
      b
    ]);
    
    let stdoutData = "";
    let pythonError = "";
    let finalOutput = null;

    python.stdout.on("data", (data) => {
      const text = data.toString();
      stdoutData += text;
      console.log("[PYTHON]", text.trim());
    });

    python.stderr.on("data", (data) => {
      const msg = data.toString().trim();
      console.error("[PYTHON ERROR]", msg);
      pythonError += msg;
    });

    python.on("close", () => {
      if (pythonError) {
        return reject(pythonError);
      }

      const matches = stdoutData.match(/-?\d+/g);
      if (matches && matches.length > 0) {
        finalOutput = matches[matches.length - 1];
      }

      if (finalOutput === null) {
        return reject("No numeric output received from Python");
      }

      resolve(Number(finalOutput));
    });
  });
};
