const express = require("express");
// const { spawn } = require("child_process");
const srcRoutes = require('./routes/srcRoutes')
const XLSX = require("xlsx");

const app = express();
app.use(express.json()); 


app.use('/', srcRoutes)


app.listen(3000, () => console.log("Server started on port 3000"));
