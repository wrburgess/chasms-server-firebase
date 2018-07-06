import { chatRelay } from '../middlewares/chasms';

module.exports = (app, urlencodedParser) => {
  app.post(
    '/chat',
    urlencodedParser,
    chatRelay,
    (req, res) => {
      if (req.chasms.acknowledge) {
        res.end();
      } else if (req.chasms.status < 400) {
        res.json(req.chasms.chatResponse);
      } else {
        res.json(req.chasms.status);
      }
    }
  );
};
