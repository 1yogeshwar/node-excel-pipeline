const express = require('express');
const controller = require('../controller/srcController')
const multer = require('multer')

const router = express.Router()
const upload = multer({
  dest: 'uploads/' // temporary folder
});

router.post('/upload', upload.single('file'), controller.uploadAndValidate);


module.exports = router;

