import ChatInbound from '../services/ChatInbound';
import ChatOutbound from '../services/ChatOutbound';
import SmsInbound from '../services/SmsInbound';
import SmsOutbound from '../services/SmsOutbound';

const chatRelay = (req, _, next) => {
  const smsOutbound = new SmsOutbound();

  if (ChatInbound.authorized(req)) {
    ChatInbound.processMessage(req)
      .then((payload) => {
        req.chasm = payload;

        if (req.chasm.validRequest && req.chasm.sendSms) {
          smsOutbound.sendMessage(req.chasm.smsResponse)
            .then(() => {
              next();
            })
            .catch((err) => {
              throw err;
            });
        } else if (req.chasm.validRequest) {
          next();
        }
      })
      .catch((err) => {
        req.chasm = { status: 403 };
        console.error('chasms.chatRelay catch error', err);
        next();
      });
  } else {
    req.chasm = { status: 403 };
    next();
  }
}

const smsRelay = (req, _, next) => {
  const smsInbound: SmsInbound = new SmsInbound();
  const chatOutbound: ChatOutbound = new ChatOutbound();

  if (smsInbound.authorized(req)) {
    SmsInbound.processMessage(req)
      .then((payload) => {
        req.chasm = payload;
        chatOutbound.sendMessage(req);
        next();
      })
      .catch((err) => {
        req.chasm = { status: 403 };
        console.error('chasms.smsRelay catch error', err);
        next();
      });
  } else {
    req.chasm = { status: 403 };
    next();
  }
}

export {
  chatRelay,
  smsRelay,
};
