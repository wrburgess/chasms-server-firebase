import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as morgan from 'morgan';

const urlencodedParser = bodyParser.urlencoded({ extended: false });

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.static('public'));

require('./routes/smsRoutes')(app, urlencodedParser);
require('./routes/chatRoutes')(app, urlencodedParser);
require('./routes/userRoutes')(app, urlencodedParser);

// If dev environment, use local config
if (!process.env.FB_SERVICE_ACCOUNT_KEY) {
  const serviceAccount = require('../.service-account-credentials.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://chasms-server-staging.firebaseio.com',
  });
} else {
  admin.initializeApp();
}

exports.chasms = functions.https.onRequest(app);
