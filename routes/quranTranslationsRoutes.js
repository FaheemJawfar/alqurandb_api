const express = require('express');
//const quranTranslationsController = require('../controllers/quranTranslationsController');
const fileUtils = require('../utils/fileUtils');
const path = require('path');
const router = express.Router();

router.get('/xml/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '..', 'quran_translations/xml', filename);
  fileUtils.checkAndSendFile(res, filePath, filename);
});


router.get('/', (req, res) => {
  // Extract translation and fileformat from query parameters
  const translation = req.query.translation;
  const fileformat = req.query.fileformat;

  // Construct filename using translation and fileformat
  const filename = `${translation}.${fileformat}`;

  // Construct the file path
  const filePath = path.join(__dirname, '..', 'quran_translations/xml', filename);

  // Send the file
  fileUtils.checkAndSendFile(res, filePath, filename);
});



module.exports = router;
