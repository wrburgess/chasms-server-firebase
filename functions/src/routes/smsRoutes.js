const { smsRelay } = require('../middlewares/chasms');

module.exports = (app, urlencodedParser) => {
  app.post(
    '/sms',
    urlencodedParser,
    smsRelay,
    (req, res) => {
      if (req.chasm.status < 400) {
        res.status(204);
      } else {
        res.sendStatus(req.chasm.status);
      }
    }
  );
};
