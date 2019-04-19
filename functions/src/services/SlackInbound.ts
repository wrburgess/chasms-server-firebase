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
    const command: any = await processCommand({ command: req.text, organization });
    const channel: any = Organization.channelFindByVal({ organization, field: 'slackChannelId', val: req.channel_id });
    let operator: any = await Operator.findByVal({ organization, field: 'slackUserName', val: req.user_name });
    let contact: any = command.contact;

    let smsResponse: any = {};
    if (command.type === commandTypes.OUTBOUND_SMS && channel.usesTwilio) {
      // construct sms response
      smsResponse = {
        body: command.messageBody,
        contact,
        status: true,
        twilioAccountPhoneNumber: channel.twilioAccountPhoneNumber,
        twilioAuthToken: channel.twilioAuthToken,
        twilioSid: channel.twilioSid,
      };
    } else {
      // negate sms response
      smsResponse = {
        body: '',
        contact: {
          id: '',
          firstName: '',
          lastName: '',
          completeSmsNumber: '',
          username: '',
        },
        status: false,
        twilioAccountPhoneNumber: '',
        twilioAuthToken: '',
        twilioSid: '',
      };
    }

    let slackResponse: any = {};
    if (channel.usesSlack && command.type !== commandTypes.INVALID) {
      slackResponse = {
        as_user: false,
        attachments: [],
        channel: req.channel_id,
        link_names: true,
        response_type: slackResponseTypes.IN_CHANNEL,
        status: true,
        text: `+${contact.username} ${command.messageBody}`,
        token: req.token,
        user: '',
      };
    } else if (channel.usesSlack && command.type === commandTypes.INVALID) {
      slackResponse = {
        as_user: false,
        attachments: [],
        channel: req.channel_id,
        link_names: true,
        response_type: slackResponseTypes.EPHEMERAL,
        status: true,
        text: `Unknown username for command: ${req.text}`,
        token: req.token,
        user: req.user_id,
      };
    }

    let channelResponse: any = {};
    if (channel.id && command.type !== commandTypes.INVALID) {
      channelResponse = {
        body: `+${contact.username} ${command.messageBody}`,
        id: channel.id,
        name: channel.name,
        status: true,
      };
    } else {
      channelResponse = {
        body: '',
        id: '',
        name: '',
        status: false,
      };
    }

    const message = {
      id: AutoId.newId(),
      status: 200,
      type: messageTypes.SLACK_INBOUND,
      requestBody: req.text,
      validRequest: true,
      archived: false,
      attachments: [],
      tags: [],
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
        completeSmsNumber: operator.completeSmsNumber,
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

    // console.log('message', message);
    Message.create(message);

    return message;
  }
}

export default SlackInbound;
