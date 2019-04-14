import * as faker from 'faker';
import * as messageTypes from '../../src/constants/messageTypes';
import * as sourceTypes from '../../src/constants/sourceTypes';
import * as slackResponseTypes from '../../src/constants/slackResponseTypes';
import * as authorTypes from '../../src/constants/authorTypes';
import SlackInbound from '../../src/services/SlackInbound';
import Operator from '../../src/models/Operator';
import Message from '../../src/models/Message';
import Contact from '../../src/models/Contact';
import AutoId from '../../src/utilities/AutoId';
import { contact, operator, organization, slackRequest } from '../factories';

describe('services/SlackInbound', () => {
  it('renders the correct Message object from a Slack command with valid Complete SMS Number', () => {
    const channelCompleteSmsNumber = faker.phone.phoneNumber('+1##########');
    const contactCompleteSmsNumber = faker.phone.phoneNumber('+1##########');
    const messageBody = faker.lorem.sentence();
    const messageId = faker.random.uuid();
    const slackMessageBody = `${contactCompleteSmsNumber} ${messageBody}`;

    slackRequest.channel_id = channelCompleteSmsNumber;
    slackRequest.user_name = operator.slackUserName;
    slackRequest.text = slackMessageBody;

    contact.completeSmsNumber = contactCompleteSmsNumber;

    organization.slackTeamId = slackRequest.team_id;
    organization.twilioAccountPhoneNumber = channelCompleteSmsNumber;
    organization.channels = {
      [channelCompleteSmsNumber]: {
        id: 'asdf',
        name: 'asdf',
        completeSmsNumber: channelCompleteSmsNumber,
        type: 'team',
        slackChannelId: slackRequest.channel_id,
      },
    };

    const channel = organization.channels[channelCompleteSmsNumber];

    const message = {
      id: messageId,
      status: 200,
      type: messageTypes.SLACK_INBOUND,
      requestBody: slackRequest.text,
      validRequest: true,
      archived: false,
      attachments: [],
      tags: [],
      smsInboundNumber: '',
      source: {
        type: sourceTypes.SLACK,
        meta: {
          ...slackRequest,
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
        status: true,
        id: channel.id,
        name: channel.name,
        body: `+${contact.username} ${messageBody}`,
      },
      apiResponse: {
        status: false,
        body: '',
      },
      slackResponse: {
        body: `+${contact.username} ${messageBody}`,
        channel_id: slackRequest.channel_id,
        response_type: slackResponseTypes.IN_CHANNEL,
        status: true,
        token: slackRequest.token,
      },
      smsResponse: {
        body: messageBody,
        completeSmsNumber: contact.completeSmsNumber,
        contact,
        status: true,
      },
    };

    const asyncOperatorMock: any = jest.spyOn(Operator, 'findByVal');
    asyncOperatorMock.mockResolvedValue(operator);
    const asyncMessageMock: any = jest.spyOn(Message, 'create');
    asyncMessageMock.mockResolvedValue(message);
    const asyncContactMock: any = jest.spyOn(Contact, 'findByValOrCreate');
    asyncContactMock.mockResolvedValue(contact);
    const AutoIdMock: any = jest.spyOn(AutoId, 'newId');
    AutoIdMock.mockImplementation(() => messageId);

    return expect(SlackInbound.processMessage({ req: slackRequest, organization })).resolves.toEqual(message);
  });

  it('renders the correct Message object from a Slack command with valid Command SMS Number', () => {
    const contactCommandSmsNumber = faker.phone.phoneNumber('+##########');
    const completeSmsNumber = `+1${contactCommandSmsNumber.substring(1)}`;
    const channelCompleteSmsNumber = faker.phone.phoneNumber('+1##########');
    const contactCompleteSmsNumber = completeSmsNumber;
    const messageBody = faker.lorem.sentence();
    const messageId = faker.random.uuid();

    const slackMessageBody = `${contactCommandSmsNumber} ${messageBody}`;

    slackRequest.channel_id = channelCompleteSmsNumber;
    slackRequest.user_name = operator.slackUserName;
    slackRequest.text = slackMessageBody;

    contact.completeSmsNumber = contactCompleteSmsNumber;

    organization.slackTeamId = slackRequest.team_id;
    organization.twilioAccountPhoneNumber = channelCompleteSmsNumber;
    organization.channels = {
      [channelCompleteSmsNumber]: {
        id: 'asdf',
        name: 'asdf',
        completeSmsNumber: channelCompleteSmsNumber,
        type: 'team',
        slackChannelId: slackRequest.channel_id,
      },
    };

    const channel = organization.channels[channelCompleteSmsNumber];

    const message = {
      id: messageId,
      status: 200,
      type: messageTypes.SLACK_INBOUND,
      requestBody: slackRequest.text,
      validRequest: true,
      archived: false,
      attachments: [],
      tags: [],
      smsInboundNumber: '',
      source: {
        type: sourceTypes.SLACK,
        meta: {
          ...slackRequest,
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
        status: true,
        id: channel.id,
        name: channel.name,
        body: `+${contact.username} ${messageBody}`,
      },
      apiResponse: {
        status: false,
        body: '',
      },
      slackResponse: {
        body: `+${contact.username} ${messageBody}`,
        channel_id: slackRequest.channel_id,
        response_type: slackResponseTypes.IN_CHANNEL,
        status: true,
        token: slackRequest.token,
      },
      smsResponse: {
        body: messageBody,
        completeSmsNumber: contact.completeSmsNumber,
        contact,
        status: true,
      },
    };

    const asyncOperatorMock: any = jest.spyOn(Operator, 'findByVal');
    asyncOperatorMock.mockResolvedValue(operator);
    const asyncMessageMock: any = jest.spyOn(Message, 'create');
    asyncMessageMock.mockResolvedValue(message);
    const asyncContactMock: any = jest.spyOn(Contact, 'findByValOrCreate');
    asyncContactMock.mockResolvedValue(contact);
    const AutoIdMock: any = jest.spyOn(AutoId, 'newId');
    AutoIdMock.mockImplementation(() => messageId);

    return expect(SlackInbound.processMessage({ req: slackRequest, organization })).resolves.toEqual(message);
  });

  it('renders the correct Message object from a Slack command with valid Contact Username', () => {
    const contactCompleteSmsNumber = faker.phone.phoneNumber('+1##########');
    const channelCompleteSmsNumber = faker.phone.phoneNumber('+1##########');
    const contactUsername = faker.internet.userName();
    const messageBody = faker.lorem.sentence();
    const messageId = faker.random.uuid();

    const slackMessageBody = `+${contactUsername} ${messageBody}`;

    slackRequest.channel_id = channelCompleteSmsNumber;
    slackRequest.user_name = operator.slackUserName;
    slackRequest.text = slackMessageBody;

    contact.completeSmsNumber = contactCompleteSmsNumber;
    contact.username = contactUsername;

    organization.slackTeamId = slackRequest.team_id;
    organization.twilioAccountPhoneNumber = channelCompleteSmsNumber;
    organization.channels = {
      [channelCompleteSmsNumber]: {
        id: 'asdf',
        name: 'asdf',
        completeSmsNumber: channelCompleteSmsNumber,
        type: 'team',
        slackChannelId: slackRequest.channel_id,
      },
    };

    const channel = organization.channels[channelCompleteSmsNumber];

    const message = {
      id: messageId,
      status: 200,
      type: messageTypes.SLACK_INBOUND,
      requestBody: slackRequest.text,
      validRequest: true,
      archived: false,
      attachments: [],
      tags: [],
      smsInboundNumber: '',
      source: {
        type: sourceTypes.SLACK,
        meta: {
          ...slackRequest,
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
        status: true,
        id: channel.id,
        name: channel.name,
        body: `+${contact.username} ${messageBody}`,
      },
      apiResponse: {
        status: false,
        body: '',
      },
      slackResponse: {
        body: `+${contact.username} ${messageBody}`,
        channel_id: slackRequest.channel_id,
        response_type: slackResponseTypes.IN_CHANNEL,
        status: true,
        token: slackRequest.token,
      },
      smsResponse: {
        body: messageBody,
        completeSmsNumber: contact.completeSmsNumber,
        contact,
        status: true,
      },
    };

    const asyncOperatorMock: any = jest.spyOn(Operator, 'findByVal');
    asyncOperatorMock.mockResolvedValue(operator);
    const asyncMessageMock: any = jest.spyOn(Message, 'create');
    asyncMessageMock.mockResolvedValue(message);
    const asyncContactMock: any = jest.spyOn(Contact, 'findByVal');
    asyncContactMock.mockResolvedValue(contact);
    const AutoIdMock: any = jest.spyOn(AutoId, 'newId');
    AutoIdMock.mockImplementation(() => messageId);

    return expect(SlackInbound.processMessage({ req: slackRequest, organization })).resolves.toEqual(message);
  });
});
