import { smsRelay } from '../middlewares/chasms';

module.exports = (app, urlencodedParser) => {
  app.post(
    '/sms',
    urlencodedParser,
    smsRelay,
    (req, res) => {

      console.log('smsRoutes > req.chasm: ', req.chasm);

      if (req.chasm.status < 400) {
        res.sendStatus(204).end();
      } else {
        const err = new Error('System error');
        console.error('smsRoutes > error: ', err.message);
        res.sendStatus(req.chasm.status).end();
      }
    }
  );
};
