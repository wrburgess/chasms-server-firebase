import Contact from '../models/Contact';
import Operator from '../models/Operator';
import Message from '../models/Message';
import AutoId from '../modules/AutoId';
import * as sourceTypes from '../constants/sourceTypes';
import * as authorTypes from '../constants/authorTypes';
import * as slackResponseTypes from '../constants/slackResponseTypes';
import * as messageTypes from '../constants/messageTypes';

class SlackInbound {
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

  static async processMessage(req: any, organization: any) {
    // const option: string = req.body.text.split(' ')[0];

    // if (option === 'dir') {
    //   req.chasms = await SlackInbound.renderSmsDir(req);
    // } else if (option === 'add') {
    //   req.chasms = await SlackInbound.addToSmsDir(req);
    // } else {
    //   req.chasms = await SlackInbound.renderPrefixError(req, option);
    // }

    const channel: any = organization.channels.filter(channel => {
      return channel.slackChannelId === req.channel_id;
    });

    let operator: any = Operator.findByVal({ field: 'slackUserName', val: req.user_name });

    let smsResponse: any = {};
    if (channel[0] && 'leading +') {
      smsResponse = {
        status: true,
        smsNumber: '',
        body: req.text,
      };
    } else {
      smsResponse = {
        status: false,
        smsNumber: '',
        body: '',
      };
    }

    let slackResponse: any = {};
    if (organization.usesSlack) {
      slackResponse = {
        status: true,
        response_type: slackResponseTypes.IN_CHANNEL,
        body: req.text,
        token: req.token,
      };
    } else {
      slackResponse = {
        status: false,
        response_type: '',
        body: '',
        token: '',
      };
    }

    const channelResponse: any = {
      status: true,
      id: channel[0].id,
      name: channel[0].name,
      body: req.text,
    };

    const message = {
      id: AutoId.newId(),
      status: 200,
      type: messageTypes.SLACK_INBOUND,
      requestBody: req.text,
      validRequest: true,
      archived: false,
      attachments: [],
      tags: [],
      smsInboundNumber: '',
      source: {
        type: sourceTypes.SLACK,
        meta: {
          ...req,
        },
      },
      author: {
        type: authorTypes.OPERATOR,
        id: operator.id,
        firstName: operator.firstName,
        lastName: operator.lastName,
        username: operator.username,
        smsNumber: operator.smsNumber,
        email: operator.email,
      },
      organization: {
        id: organization.id,
        name: organization.name,
      },
      channelResponse: {
        ...channelResponse,
      },
      apiResponse: {
        status: false,
        body: '',
      },
      slackResponse: {
        ...slackResponse,
      },
      smsResponse: {
        ...smsResponse,
      },
    };

    Message.create(message);

    return message;
  }
}

export default SlackInbound;
