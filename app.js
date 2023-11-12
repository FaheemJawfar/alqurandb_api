const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const morgan = require('morgan');
const axios = require('axios');
const cron = require('node-cron'); 


const port = 3000; 



app.use(morgan(':remote-addr :remote-user :method :url :status :res[content-length] - :response-time ms'));


const dataFilePath = path.join(__dirname, 'data.json');


//Initialize app
app.get('/', (req, res) => {
  res.send('Welcome to AlQuranDB API');
});


const pingServer = () => {
  axios.get('https://exam-partner-api.onrender.com/')
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



// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
