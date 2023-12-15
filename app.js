const express = require('express');
const cron = require('node-cron');
const axios = require('axios');
const routes = require('./routes/index');

const app = express();
const port = 3000;

app.use(routes);

// Function to ping a remote server using Axios
const pingServer = () => {
  axios.get('https://alqurandb-api.onrender.com/')
    .then((response) => {
      console.log(`Server pinged with status code: ${response.status}`);
    })
    .catch((error) => {
      console.error(`Error: ${error.message}`);
    });
};

// Schedule a cron job to ping the server every 14 minutes
cron.schedule('*/14 * * * *', () => {
  pingServer();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
