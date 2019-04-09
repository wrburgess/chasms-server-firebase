import * as admin from 'firebase-admin';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as functions from 'firebase-functions';
import * as morgan from 'morgan';
import * as sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

const urlencodedParser = bodyParser.urlencoded({ extended: false });

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.static('public'));

require('./routes/apiRoutes')(app, urlencodedParser);
require('./routes/smsRoutes')(app, urlencodedParser);
require('./routes/slackRoutes')(app, urlencodedParser);
require('./routes/contactRoutes')(app, urlencodedParser);
require('./routes/organizationRoutes')(app, urlencodedParser);

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

exports.onMessageCreate = functions.firestore
  .document('organizations/{organizationId}/messages/{messageId}')
  .onCreate((documentSnapshot, context) => {
    console.log('path', documentSnapshot.ref.path);
  });

exports.chasms = functions.https.onRequest(app);
