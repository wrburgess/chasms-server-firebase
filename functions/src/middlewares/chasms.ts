import ChatInbound from '../services/ChatInbound';
import ChatOutbound from '../services/ChatOutbound';
import SmsInbound from '../services/SmsInbound';
import SmsOutbound from '../services/SmsOutbound';
import Organization from '../models/Organization';

const chatRelay = async (req, _, next) => {
  try {
    const { channel_id } = req.body;
    const organization = await Organization.findByVal({ field: 'slackChannelId', val: channel_id });

    if (organization) {
      req.organization = organization;

      const smsOutbound: SmsOutbound = new SmsOutbound(req);
      const payload = await ChatInbound.processMessage(req);
      req.chasms = payload;
      const { validRequest, sendSms, smsResponse } = req.chasms;

      if (validRequest && sendSms) {
        await smsOutbound.sendMessage(smsResponse)
        next();
      } else if (validRequest) {
        next();
      }
    } else {
      req.chasms = { status: 403 };
      next();
    }
  } catch (err) {
    req.chasms = { status: 403 };
    console.error('chasms > chatRelay: ', err);
    next();
  };
}

const smsRelay = async (req, _, next) => {
  try {
    const { AccountSid } = req.body;
    req.organization = await Organization.findByVal({ field: 'twilioSid', val: AccountSid });
    const chatOutbound: ChatOutbound = new ChatOutbound(req);

    if (req.organization) {
      req.chasms = await SmsInbound.processMessage(req);
      chatOutbound.sendMessage(req);
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
