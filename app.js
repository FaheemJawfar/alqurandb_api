const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const morgan = require('morgan');
const axios = require('axios');
const cron = require('node-cron'); 


const port = 3000; 



app.use(morgan(':remote-addr :remote-user :method :url :status :res[content-length] - :response-time ms'));


//Initialize app
app.get('/', (req, res) => {
  res.send('Welcome to AlQuranDB API');
});


const pingServer = () => {
  axios.get('https://alqurandb-api.onrender.com/')
  .then((response) => {
    console.log(`Server pinged with status code: ${response.status}`);
  })
  .catch((error) => {
    console.error(`Error: ${error.message}`);
  });
};



// Schedule the ping job every 14 minutes (*/14)
cron.schedule('*/14 * * * *', () => {
  pingServer();
});



// Endpoint to download a file by passing filename
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'quran_translations/xml', filename); // Update 'your-folder' with the actual folder name

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath);

    // Set the Content-Disposition header to prompt the user to download the file
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Length', stat.size); // Set Content-Length header
    res.sendFile(filePath);
  } else {
    // Return 404 if the file does not exist
    res.status(404).send('File not found');
  }
});



// Get Quran Translations in XML format.
app.get('/quran_translations/xml/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'quran_translations/xml', filename);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath);

    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Length', stat.size); // Set Content-Length header
    res.sendFile(filePath);
  } else {
    // Return 404 if the file does not exist
    res.status(404).send('File not found');
  }
});




// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
