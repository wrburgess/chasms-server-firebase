import { apiRelay } from '../middlewares/chasms';

module.exports = (app, urlencodedParser) => {
  app.post('/message/create', urlencodedParser, apiRelay, (req, res) => {
    if (req.chasms.status < 400) {
      res.sendStatus(204).end();
    } else {
      const err = new Error('System error');
      console.error('apiRoutes > error: ', err.message);
      res.sendStatus(req.chasms.status).end();
    }
  });
};
