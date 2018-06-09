const { smsRelay } = require('../middlewares/chasms');

module.exports = (app, urlencodedParser) => {
  app.post(
    '/api/sms/inbound',
    urlencodedParser,
    smsRelay,
    (req, res) => {
      if (req.chasm.status < 400) {
        res.writeHead(req.chasm.status, { 'Content-Type': 'text/xml' });
        res.end('<Response></Response>');
      } else {
        res.sendStatus(req.chasm.status);
      }
    },
  );
};
