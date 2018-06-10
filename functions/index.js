const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const functions = require('firebase-functions');
const morgan = require('morgan');

const { chatRelay, smsRelay } = require('./middlewares/chasms');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.static('public'));

require('./routes/smsRoutes')(app, urlencodedParser);
require('./routes/chatRoutes')(app, urlencodedParser);

// If dev environment, use local config
if (!process.env.FB_SERVICE_ACCOUNT_KEY) {
  const serviceAccount = require('./service-account-credentials.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://chasms-server-staging.firebaseio.com',
  });
} else {
  admin.initializeApp();
}

exports.chasms = functions.https.onRequest(app);
