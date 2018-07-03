import ChatInbound from '../services/ChatInbound';
import ChatOutbound from '../services/ChatOutbound';
import SmsInbound from '../services/SmsInbound';
import SmsOutbound from '../services/SmsOutbound';
import Organization from '../models/Organization';

const chatRelay = async (req, _, next) => {
  const organization = await Organization.findByVal({ field: 'slackChannelId', val: req.body.channel_id });
  req.chasms.organization = organization;

  if (organization) {
    const smsOutbound: SmsOutbound = new SmsOutbound(req);

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

const smsRelay = async (req, _, next) => {
  const organization = await Organization.findByVal({ field: 'slackChannelId', val: req.body.channel_id });
  req.chasms.organization = organization;

  const smsInbound: SmsInbound = new SmsInbound(req);
  const chatOutbound: ChatOutbound = new ChatOutbound(req);

  if (organization) {
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
