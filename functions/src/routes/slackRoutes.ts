import { slackRelay } from '../middlewares/chasms';

module.exports = (app, urlencodedParser) => {
  app.post(
    '/slack',
    urlencodedParser,
    slackRelay,
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
