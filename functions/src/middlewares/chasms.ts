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
              console.error('chasms > chatRelay > smsOutbound.sendMessage > error: ', err);
              next();
            });
        } else if (req.chasm.validRequest) {
          next();
        }
      })
      .catch((err) => {
        req.chasm = { status: 403 };
        console.error('chasms > chatRelay > ChatInbound.processMessage > error: ', err);
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
      .then(payload => {
        req.chasm = payload;

        console.log('chasms > smsRelay > SmsInbound.processMessage > req.chasm: ', req.chasm);

        chatOutbound.sendMessage(req)
          .then()
          .catch(err => {
            console.error('chasms > smsRelay > chatOutbound.sendMessage > error: ', err);
          });

        next();
      })
      .catch(err => {
        req.chasm = { status: 403 };
        console.error('chasms > smsRelay > SmsInbound.processMessage > error: ', err);
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
