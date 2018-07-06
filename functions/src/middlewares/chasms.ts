import SlackInbound from '../services/SlackInbound';
import SlackOutbound from '../services/SlackOutbound';
import SmsInbound from '../services/SmsInbound';
import SmsOutbound from '../services/SmsOutbound';
import Organization from '../models/Organization';

const slackRelay = async (req, _, next) => {
  try {
    const { channel_id } = req.body;
    const organization = await Organization.findByVal({ field: 'slackChannelId', val: channel_id });

    if (organization) {
      req.organization = organization;

      const smsOutbound: SmsOutbound = new SmsOutbound(req);
      req.chasms = await SlackInbound.processMessage(req);
      const { validRequest, sendSms, smsResponse } = req.chasms;

      if (validRequest && sendSms) {
        smsOutbound.sendMessage(smsResponse)
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
    console.error('chasms > slackRelay: ', err);
    next();
  };
}

const smsRelay = async (req, _, next) => {
  try {
    const { AccountSid } = req.body;
    const organization = await Organization.findByVal({ field: 'twilioSid', val: AccountSid });
    req.organization = organization;
    const slackOutbound: SlackOutbound = new SlackOutbound(req);

    if (organization) {
      req.chasms = await SmsInbound.processMessage(req);
      slackOutbound.sendMessage(req);
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
  slackRelay,
  smsRelay,
};
