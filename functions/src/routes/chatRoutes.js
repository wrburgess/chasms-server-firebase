const { chatRelay } = require('../middlewares/chasms');

module.exports = (app, urlencodedParser) => {
  app.post(
    '/chat',
    urlencodedParser,
    chatRelay,
    (req, res) => {
      if (req.chasm.status < 400) {
        res.json(req.chasm.chatResponse);
      } else {
        res.json(req.chasm.status);
      }
    }
  );
};
