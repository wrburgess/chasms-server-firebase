const { chatRelay } = require('../middlewares/chasms');

module.exports = (app, urlencodedParser) => {
  app.post(
    '/api/chat/inbound',
    urlencodedParser,
    chatRelay,
    (req, res) => {
      if (req.chasm.status < 400) {
        console.log('ChatInbound response: ', req);
        res.json(req.chasm.chatResponse);
      } else {
        res.sendStatus(req.chasm.status);
      }
    },
  );
};
