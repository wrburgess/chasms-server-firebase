import SlackInbound from '../services/SlackInbound';
import Organization from '../models/Organization';

// {
//   reqBody: {
//     token: 'SDRmZxxxxxxxJAFuE5Dm',
//     team_id: 'T0xxxxxxE1',
//     team_domain: 'allaboardapps',
//     channel_id: 'G9xxxxxH8',
//     channel_name: 'privategroup',
//     user_id: 'U0xxxxxJ3',
//     user_name: 'wrburgess',
//     command: '/sms',
//     text: 'dir',
//     response_url: 'https://hooks.slack.com/commands/T0xxxxxE1/3939xxxxxxx24/5sxxxxxxxxxxxj0FEeGjs',
//     trigger_id: '393xxxxxx4273.1552xxxxxx77.7ca707exxxxxx58c478bdf1xxxxx86'
//   }
// }

const slackRelay = async (req, _, next) => {
  try {
    const { channel_id } = req.body;
    const organization: any = await Organization.findByVal({
      field: 'slackChannelId',
      val: channel_id,
    });

    if (organization && organization.usesSlack) {
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
