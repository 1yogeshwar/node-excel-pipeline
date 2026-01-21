

---

# Excel Batch Processing with Node.js & Python

## Overview

This project processes Excel files using **Node.js** and **Python**, with a focus on **scalability, clarity, and fault tolerance**.
It validates headers, processes data rows in **batches**, performs calculations via a Python script, and exports results to Excel.

---

## Key Features

* Batch-wise row processing (configurable batch size)
* Header validation with fail-fast behavior
* Row-level validation and calculation using Python
* Real-time Node ↔ Python communication
* Lightweight, structured logging
* Partial success handling (invalid rows don’t stop processing)
* Excel export with status and results

---

## Processing Strategy

* **File-level errors** (invalid headers, unreadable file) → stop execution
* **Row-level errors** → logged and marked as FAILED
* **Batch-wise execution** → reduced logging overhead and better performance

---

## Tech Stack

* Node.js (Express, child_process)
* Python (calculation & validation)
* XLSX (Excel read/write)

---

## Outcome

Improved performance, controlled memory usage, and clear observability for large Excel imports.

---

