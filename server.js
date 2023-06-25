require('dotenv').config(); // Import our .env
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const https = require('https');
const fs = require('fs');
const logger = require('./lib/logger')('server');

app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(require('./config/setup'));
app.use(require('./config/routes'));
const connectDB = require('./lib/database');

connectDB();



const port = process.env.PORT || 3001;
if (process.env.NODE_ENV === 'local') {
  https
    .createServer(
      {
        key: fs.readFileSync('certs/key.pem'),
        cert: fs.readFileSync('certs/crt.pem'),
        requestCert: false,
        rejectUnauthorized: false
      },
      app
    )
    .listen(port, () => {
      logger.info(`listening on port: ${port} (local)`); // eslint-disable-line no-console
    });
} else {
  app.listen(port, () => {
    logger.info(`listening on port: ${port} (cloud)`); // eslint-disable-line no-console
  });
}


module.exports = app;
