const admin = require('firebase-admin');
const functions = require('firebase-functions');

const chatInbound = require('./services/chatInbound');
const smsInbound = require('./services/smsInbound');

// If dev environment, use local config
if (!process.env.FB_SERVICE_ACCOUNT_KEY) {
  const serviceAccount = require('./config.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://chasms-server-staging.firebaseio.com',
  });
} else {
  admin.initializeApp();
}

exports.chatInbound = functions.https.onRequest(chatInbound);
exports.smsInbound = functions.https.onRequest(smsInbound);
