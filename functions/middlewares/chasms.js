const ChatInbound = require('../services/ChatInbound');
const ChatOutbound = require('../services/ChatOutbound');
const SmsInbound = require('../services/SmsInbound');
const SmsOutbound = require('../services/SmsOutbound');

function chatRelay(req, res, next) {
  const smsOutbound = new SmsOutbound();

  if (ChatInbound.authorized(req)) {
    ChatInbound.processMessage(req)
      .then((payload) => {
        req.chasm = payload;

        console.log('ChatInbound req object: ', req);

        if (req.chasm.validRequest && req.chasm.sendSms) {
          smsOutbound.sendMessage(req.chasm.smsResponse)
            .then(() => {
              next();
              return null;
            })
            .catch((err) => {
              console.error('chasms.js > chatRelay: ', err);
            });
        } else if (req.chasm.validRequest) {
          next();
          return null;
        }

        return null;
      })
      .catch((err) => {
        req.chasm = { status: 403 };
        console.log('chasms.js > chatRelay: ', err);
        next();
      });
  } else {
    req.chasm = { status: 403 };
    next();
    return null;
  }

  return null;
}

function smsRelay(req, res, next) {
  const smsInbound = new SmsInbound();
  const chatOutbound = new ChatOutbound();

  if (smsInbound.authorized(req)) {
    SmsInbound.processMessage(req)
      .then((payload) => {
        req.chasm = payload;
        chatOutbound.sendMessage(req);
        next();
        return null;
      })
      .catch((err) => {
        req.chasm = { status: 403 };
        console.log('chasms.smsRelay catch error', err);
        next();
      });
  } else {
    req.chasm = { status: 403 };

    next();
    return null;
  }

  return null;
}

module.exports = {
  chatRelay,
  smsRelay,
};
