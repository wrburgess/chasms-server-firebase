import SlackInbound from '../services/SlackInbound';
import Organization from '../models/Organization';

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

export default slackRelay;
