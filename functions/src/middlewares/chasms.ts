import ChatInbound from '../services/ChatInbound';
import ChatOutbound from '../services/ChatOutbound';
import SmsInbound from '../services/SmsInbound';
import SmsOutbound from '../services/SmsOutbound';
import Organization from '../models/Organization';

const chatRelay = async (req, _, next) => {
  try {
    const organization = await Organization.findByVal({ field: 'slackChannelId', val: req.body.channel_id });
    req.organization = organization;

    if (organization) {
      const smsOutbound: SmsOutbound = new SmsOutbound(req);
      const payload = await ChatInbound.processMessage(req);

      req.chasms = payload;
      if (req.chasms.validRequest && req.chasm.sendSms) {
        await smsOutbound.sendMessage(req.chasm.smsResponse)
        next();
      } else if (req.chasms.validRequest) {
        next();
      }
    } else {
      req.chasms = { status: 403 };
      next();
    }
  } catch (err) {
    req.chasms = { status: 403 };
    console.error('chasms > chatRelay > ChatInbound.processMessage > error: ', err);
    next();
  };
}

const smsRelay = async (req, _, next) => {
  try {
    const organization = await Organization.findByVal({ field: 'slackChannelId', val: req.body.channel_id });
    req.organization = organization;

    const chatOutbound: ChatOutbound = new ChatOutbound(req);

    if (organization) {
      const payload = SmsInbound.processMessage(req);
      req.chasms = payload;
      await chatOutbound.sendMessage(req)
      next();
    } else {
      req.chasms = { status: 403 };
      next();
    }
  } catch (err) {
    req.chasms = { status: 403 };
    console.error('chasms > smsRelay: ', err);
    next();
  };
}

export {
  chatRelay,
  smsRelay,
};
