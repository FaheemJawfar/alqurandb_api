const express = require('express');
const xml2js = require('xml2js');
const fs = require('fs');
const fileUtils = require('../utils/fileUtils');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
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




router.get('/getAyaTranslationXML', (req, res) => {
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




router.get('/getAyaTranslation', (req, res) => {
    const suraIndex = req.query.sura;
    const ayaIndex = req.query.aya;
    const filename = req.query.translation + '.db';

    const dbPath = path.join(__dirname, '..', 'quran_translations/sqlite', filename);

    // Open the database
    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error connecting to the database');
            return;
        }
        console.log('Connected to the SQLite database.');
    });

    const query = `SELECT text FROM tamil_translation WHERE sura_number = ? AND aya_number = ?`;
    
    // Execute the query
    db.get(query, [suraIndex, ayaIndex], (err, row) => {
        if (err) {
            res.status(500).send('Error executing the query');
            return;
        }

        if (row) {
            res.json({
                sura: suraIndex,
                aya: ayaIndex,
                text: row.text
            });
        } else {
            res.status(404).send('Sura or Aya not found');
        }
    });

    // Close the database connection
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Closed the database connection.');
    });
});




module.exports = router;
