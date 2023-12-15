const fs = require('fs');
const path = require('path');

const downloadController = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '..', 'quran_translations/xml', filename);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath);

    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Length', stat.size);
    
    // Send the file
    res.sendFile(filePath);
  } else {
    // Return 404 if the file does not exist
    res.status(404).send('File not found');
  }
};

module.exports = downloadController;
