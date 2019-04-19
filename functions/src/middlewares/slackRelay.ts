import SlackInbound from '../services/SlackInbound';
import Organization from '../models/Organization';

const slackRelay = async (req, _, next) => {
  try {
    const { channel_id } = req.body;
    const organization: any = await Organization.findBySlackChannelId(channel_id);

    const channel = Organization.channelFindByVal({
      organization,
      field: 'slackChannelId',
      val: channel_id,
    });

    if (organization && channel && channel.usesSlack) {
      SlackInbound.processMessage({ req: req.body, organization });
      req.chasms = { acknowledge: true };
      next();
    } else {
      console.error('chasms > slackRelay: ', 'Invalid organization or credentials');
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
