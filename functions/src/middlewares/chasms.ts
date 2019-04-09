import ApiInbound from '../services/ApiInbound';
import SlackInbound from '../services/SlackInbound';
import SlackOutbound from '../services/SlackOutbound';
import SmsInbound from '../services/SmsInbound';
import Organization from '../models/Organization';

const apiRelay = async (req, _, next) => {
  try {
    const { organizationId } = req.body;
    const organization = await Organization.findById({
      id: organizationId,
    });

    if (organization) {
      req.organization = organization;
      ApiInbound.processMessage(req);
      req.chasms = { status: 200 };
      next();
    } else {
      req.chasms = { status: 403 };
      next();
    }
  } catch (err) {
    req.chasms = { status: 500 };
    console.error('chasms > apiRelay: ', err);
    next();
  }
};

const slackRelay = async (req, _, next) => {
  try {
    const { channel_id } = req.body;
    const organization = await Organization.findByVal({
      field: 'slackChannelId',
      val: channel_id,
    });

    if (organization) {
      req.organization = organization;
      SlackInbound.processMessage(req);
      req.chasms = { acknowledge: true };
      next();
    } else {
      req.chasms = { status: 403 };
      next();
    }
  } catch (err) {
    req.chasms = { status: 500 };
    console.error('chasms > slackRelay: ', err);
    next();
  }
};

const smsRelay = async (req, _, next) => {
  try {
    const { AccountSid } = req.body;
    const organization = await Organization.findByVal({
      field: 'twilioSid',
      val: AccountSid,
    });

    if (organization) {
      req.organization = organization;
      req.chasms = await SmsInbound.processMessage(req);
      SlackOutbound.sendPublicMessage(req);
      next();
    } else {
      req.chasms = { status: 403 };
      next();
    }
  } catch (err) {
    req.chasms = { status: 403 };
    console.error('chasms > smsRelay: ', err);
    next();
  }
};

export { slackRelay, smsRelay, apiRelay };
