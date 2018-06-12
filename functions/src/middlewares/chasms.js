const ChatInbound = require('../services/ChatInbound');
const ChatOutbound = require('../services/ChatOutbound');
const SmsInbound = require('../services/SmsInbound');
const SmsOutbound = require('../services/SmsOutbound');

function chatRelay(req, res, next) {
  const smsOutbound = new SmsOutbound();

  if (ChatInbound.authorized(req)) {
    const payload = ChatInbound.processMessage(req);

    try {
      req.chasm = payload;

      if (req.chasm.validRequest && req.chasm.sendSms) {
        smsOutbound.sendMessage(req.chasm.smsResponse)
          .then(() => {
            next();
          })
          .catch((err) => {
            console.error('chasms.js > chatRelay: ', err);
            next();
          });
      } else if (req.chasm.validRequest) {
        next();
      }
    } catch(err) {
      req.chasm = { status: 403 };
      console.error('chasms.js > chatRelay: ', err);
      next();
    };
  } else {
    req.chasm = { status: 403 };
    next();
  }
}

function smsRelay(req, res, next) {
  const smsInbound = new SmsInbound();
  const chatOutbound = new ChatOutbound();

  if (smsInbound.authorized(req)) {
    const payload = SmsInbound.processMessage(req);

    try {
      req.chasm = payload;
      chatOutbound.sendMessage(req);
      next();
    } catch (err) {
      req.chasm = { status: 403 };
      console.error('chasms.smsRelay chatOutbound.sendMessage failure: ', err);
      next();
    }
  } else {
    req.chasm = { status: 403 };
    console.error('chasms.smsRelay unauthorized: ', err);
    next();
  }
}

module.exports = {
  chatRelay,
  smsRelay,
};
