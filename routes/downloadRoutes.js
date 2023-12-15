const express = require('express');
const downloadController = require('../controllers/downloadController');
const fileUtils = require('../utils/fileUtils');
const path = require('path');
const router = express.Router();

router.get('/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '..', 'quran_translations/xml', filename);
  fileUtils.checkAndSendFile(res, filePath, filename);
});

module.exports = router;
