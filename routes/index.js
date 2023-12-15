const express = require('express');
const loggingMiddleware = require('../middleware/loggingMiddleware');
const downloadRoutes = require('./downloadRoutes');
const quranTranslationsRoutes = require('./quranTranslationsRoutes');

const router = express.Router();

// Apply middleware
router.use(loggingMiddleware);

// Welcome endpoint
router.get('/', (req, res) => {
    res.send('Welcome to AlQuranDB API');
  });

// Use specific routes
router.use('/download', downloadRoutes);
router.use('/quran_translations', quranTranslationsRoutes);

module.exports = router;
