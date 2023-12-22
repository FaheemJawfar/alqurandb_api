const express = require('express');
const xml2js = require('xml2js');
const fs = require('fs');
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




router.get('/getAyaTranslation', (req, res) => {
  const suraIndex = req.query.sura;
  const ayaIndex = req.query.aya;
  const filename = req.query.translation + '.xml';

  const filePath = path.join(__dirname, '..', 'quran_translations/xml', filename);

  fs.readFile(filePath, (err, data) => {
      if (err) {
          res.status(500).send('Error reading the XML file');
          return;
      }

      xml2js.parseString(data, (err, result) => {
          if (err) {
              res.status(500).send('Error parsing the XML file');
              return;
          }

          try {
              const ayaText = result.quran.sura.find(s => s.$.index === suraIndex).aya.find(a => a.$.index === ayaIndex).$.text;
              // Returning the result in JSON format
              res.json({
                  sura: suraIndex,
                  aya: ayaIndex,
                  text: ayaText
              });
          } catch (error) {
              res.status(404).send('Sura or Aya not found');
          }
      });
  });
});




module.exports = router;
