import Organization from '../models/Organization';
import Operator from '../models/Operator';
import Message from '../models/Message';
import AutoId from '../utilities/AutoId';
import processCommand from '../utilities/processCommand';
import * as sourceTypes from '../constants/sourceTypes';
import * as authorTypes from '../constants/authorTypes';
import * as slackResponseTypes from '../constants/slackResponseTypes';
import * as messageTypes from '../constants/messageTypes';
import * as commandTypes from '../constants/commandTypes';

class SlackInbound {
  // {
  //   token: 'SDRmZI671hiYZqzrJAFuE5Dm',
  //   team_id: 'T0FFFQFE1',
  //   team_domain: 'allaboardapps',
  //   channel_id: 'G9RMHEMH8',
  //   channel_name: 'privategroup',
  //   user_id: 'U0FFL28J3',
  //   user_name: 'wrburgess',
  //   command: '/sms',
  //   text: '+7735516808 test 04',
  //   response_url: 'https://hooks.slack.com/commands/T0FFFQFE1/605474729588/y9EHANuN0maT9BxNxtxqzsUe',
  //   trigger_id: '594564187171.15525831477.23a8017c74fa742d4d8ebfcfda0ce320'
  // }

  static async processMessage({ req, organization }) {
    const command: any = processCommand({ command: req.text, organization });
    const channel: any = Organization.channelFindByVal({ organization, field: 'slackChannelId', val: req.channel_id });
    let operator: any = Operator.findByVal({ organization, field: 'slackUserName', val: req.user_name });
    let contact: any = command.contact;

    let smsResponse: any = {};
    if (channel && command.type === commandTypes.OUTBOUND_SMS) {
      // construct sms response
      smsResponse = {
        status: true,
        smsNumber: command.smsNumber,
        body: req.text,
        contact,
      };
    } else {
      // negate sms response
      smsResponse = {
        status: false,
        smsNumber: '',
        body: '',
        contact: {},
      };
    }

    let slackResponse: any = {};
    if (organization.usesSlack) {
      slackResponse = {
        status: true,
        response_type: slackResponseTypes.IN_CHANNEL,
        body: req.text,
        token: req.token,
        channel_id: req.channel_id,
      };
    } else {
      slackResponse = {
        status: false,
        response_type: '',
        body: '',
        token: '',
        channel_id: '',
      };
    }

    const channelResponse: any = {
      status: true,
      id: channel.id,
      name: channel.name,
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
