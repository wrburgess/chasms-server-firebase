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
import {
  ChannelFactory,
  ContactFactory,
  MessageFactory,
  OperatorFactory,
  OrganizationFactory,
  SlackRequestFactory,
} from '../factories';

describe('services/SlackInbound', () => {
  it('renders the correct Message object from a Slack command with valid Complete SMS Number', () => {
    const contactCompleteSmsNumber = faker.phone.phoneNumber('+1##########');
    const messageBody = faker.lorem.sentence();
    const messageId = faker.random.uuid();
    const slackChannelId: string = faker.random.uuid();
    const slackMessageBody = `${contactCompleteSmsNumber} ${messageBody}`;
    const operator = new OperatorFactory({});

    const slackRequest = new SlackRequestFactory({
      channel_id: slackChannelId,
      user_name: operator.slackUserName,
      text: slackMessageBody,
    });

    const contact = new ContactFactory({ completeSmsNumber: contactCompleteSmsNumber });

    const organization = new OrganizationFactory({});

    const channel = new ChannelFactory({
      slackChannelId,
    });

    organization.channels[channel.id] = channel;
    organization.slackChannelIds.push[slackChannelId];

    const message = new MessageFactory({
      id: messageId,
      status: 200,
      type: messageTypes.SLACK_INBOUND,
      requestBody: slackRequest.text,
      validRequest: true,
      archived: false,
      attachments: [],
      tags: [],
      source: {
        type: sourceTypes.SLACK,
        meta: {
          ...slackRequest,
        },
      },
      author: {
        completeSmsNumber: operator.completeSmsNumber,
        email: operator.email,
        firstName: operator.firstName,
        id: operator.id,
        lastName: operator.lastName,
        type: authorTypes.OPERATOR,
        username: operator.username,
      },
      organization: {
        id: organization.id,
        name: organization.name,
      },
      channelResponse: {
        body: `+${contact.username} ${messageBody}`,
        id: channel.id,
        name: channel.name,
        status: true,
      },
      apiResponse: {
        status: false,
        body: '',
      },
      slackResponse: {
        as_user: false,
        attachments: [],
        channel: slackRequest.channel_id,
        link_names: true,
        response_type: slackResponseTypes.IN_CHANNEL,
        status: true,
        text: `+${contact.username} ${messageBody}`,
        token: slackRequest.token,
        user: '',
      },
      smsResponse: {
        body: messageBody,
        contact,
        status: true,
        twilioAccountPhoneNumber: channel.twilioAccountPhoneNumber,
        twilioAuthToken: channel.twilioAuthToken,
        twilioSid: channel.twilioSid,
      },
    });

    const asyncOperatorMock: any = jest.spyOn(Operator, 'findByValOrCreate');
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
    const contactCompleteSmsNumber = completeSmsNumber;
    const messageBody = faker.lorem.sentence();
    const messageId = faker.random.uuid();
    const slackChannelId = faker.random.uuid();
    const operator = new OperatorFactory({});

    const slackMessageBody = `${contactCommandSmsNumber} ${messageBody}`;

    const slackRequest = new SlackRequestFactory({
      channel_id: slackChannelId,
      user_name: operator.slackUserName,
      text: slackMessageBody,
    });

    const contact = new ContactFactory({ completeSmsNumber: contactCompleteSmsNumber });

    const organization = new OrganizationFactory({});

    const channel = new ChannelFactory({
      slackChannelId,
    });

    organization.channels[channel.id] = channel;
    organization.slackChannelIds.push[slackChannelId];

    const message = new MessageFactory({
      id: messageId,
      status: 200,
      type: messageTypes.SLACK_INBOUND,
      requestBody: slackRequest.text,
      validRequest: true,
      archived: false,
      attachments: [],
      tags: [],
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
        as_user: false,
        attachments: [],
        channel: slackRequest.channel_id,
        link_names: true,
        response_type: slackResponseTypes.IN_CHANNEL,
        status: true,
        text: `+${contact.username} ${messageBody}`,
        token: slackRequest.token,
        user: '',
      },
      smsResponse: {
        body: messageBody,
        contact,
        status: true,
        twilioAccountPhoneNumber: channel.twilioAccountPhoneNumber,
        twilioAuthToken: channel.twilioAuthToken,
        twilioSid: channel.twilioSid,
      },
    });

    const asyncOperatorMock: any = jest.spyOn(Operator, 'findByValOrCreate');
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
    const contactUsername = faker.internet.userName();
    const messageBody = faker.lorem.sentence();
    const messageId = faker.random.uuid();
    const slackChannelId = faker.random.uuid();
    const operator = new OperatorFactory({});

    const slackMessageBody = `+${contactUsername} ${messageBody}`;

    const slackRequest = new SlackRequestFactory({
      channel_id: slackChannelId,
      user_name: operator.slackUserName,
      text: slackMessageBody,
    });

    const contact = new ContactFactory({ completeSmsNumber: contactCompleteSmsNumber, username: contactUsername });

    const organization = new OrganizationFactory({});

    const channel = new ChannelFactory({
      slackChannelId,
    });

    organization.channels[channel.id] = channel;
    organization.slackChannelIds.push[slackChannelId];

    const message = new MessageFactory({
      id: messageId,
      status: 200,
      type: messageTypes.SLACK_INBOUND,
      requestBody: slackRequest.text,
      validRequest: true,
      archived: false,
      attachments: [],
      tags: [],
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
        as_user: false,
        attachments: [],
        channel: slackRequest.channel_id,
        link_names: true,
        response_type: slackResponseTypes.IN_CHANNEL,
        status: true,
        text: `+${contact.username} ${messageBody}`,
        token: slackRequest.token,
        user: '',
      },
      smsResponse: {
        body: messageBody,
        contact,
        status: true,
        twilioAccountPhoneNumber: channel.twilioAccountPhoneNumber,
        twilioAuthToken: channel.twilioAuthToken,
        twilioSid: channel.twilioSid,
      },
    });

    const asyncOperatorMock: any = jest.spyOn(Operator, 'findByValOrCreate');
    asyncOperatorMock.mockResolvedValue(operator);
    const asyncMessageMock: any = jest.spyOn(Message, 'create');
    asyncMessageMock.mockResolvedValue(message);
    const asyncContactMock: any = jest.spyOn(Contact, 'findByVal');
    asyncContactMock.mockResolvedValue(contact);
    const AutoIdMock: any = jest.spyOn(AutoId, 'newId');
    AutoIdMock.mockImplementation(() => messageId);

    return expect(SlackInbound.processMessage({ req: slackRequest, organization })).resolves.toEqual(message);
  });

  it('renders the correct Message object from a Slack command with an invalid Contact Username', () => {
    const contactUsername = faker.internet.userName();
    const messageBody = faker.lorem.sentence();
    const messageId = faker.random.uuid();
    const slackChannelId = faker.random.uuid();
    const operator = new OperatorFactory({});

    const slackMessageBody = `+${contactUsername} ${messageBody}`;

    const slackRequest = new SlackRequestFactory({
      channel_id: slackChannelId,
      user_name: operator.slackUserName,
      text: slackMessageBody,
    });

    const organization = new OrganizationFactory({});

    const channel = new ChannelFactory({
      slackChannelId,
    });

    organization.channels[channel.id] = channel;
    organization.slackChannelIds.push[slackChannelId];

    const message = new MessageFactory({
      id: messageId,
      status: 200,
      type: messageTypes.SLACK_INBOUND,
      requestBody: slackRequest.text,
      validRequest: true,
      archived: false,
      attachments: [],
      tags: [],
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
        status: false,
        id: '',
        name: '',
        body: '',
      },
      apiResponse: {
        status: false,
        body: '',
      },
      slackResponse: {
        as_user: false,
        attachments: [],
        channel: slackRequest.channel_id,
        link_names: true,
        response_type: slackResponseTypes.EPHEMERAL,
        status: true,
        text: `Unknown username for command: +${contactUsername} ${messageBody}`,
        token: slackRequest.token,
        user: slackRequest.user_id,
      },
      smsResponse: {
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
      },
    });

    const asyncOperatorMock: any = jest.spyOn(Operator, 'findByValOrCreate');
    asyncOperatorMock.mockResolvedValue(operator);
    const asyncMessageMock: any = jest.spyOn(Message, 'create');
    asyncMessageMock.mockResolvedValue(message);
    const asyncContactMock: any = jest.spyOn(Contact, 'findByVal');
    asyncContactMock.mockResolvedValue({});
    const AutoIdMock: any = jest.spyOn(AutoId, 'newId');
    AutoIdMock.mockImplementation(() => messageId);

    return expect(SlackInbound.processMessage({ req: slackRequest, organization })).resolves.toEqual(message);
  });

  it('renders the correct Message object from a Slack command of `dir`', () => {
    const messageBody = 'dir';
    const messageId = faker.random.uuid();
    const slackChannelId = faker.random.uuid();
    const operator = new OperatorFactory({});

    const slackMessageBody = messageBody;

    const slackRequest = new SlackRequestFactory({
      channel_id: slackChannelId,
      user_name: operator.slackUserName,
      text: slackMessageBody,
    });

    const organization = new OrganizationFactory({});

    const channel = new ChannelFactory({
      slackChannelId,
    });

    organization.channels[channel.id] = channel;
    organization.slackChannelIds.push[slackChannelId];

    const attachments = [
      {
        fallback: 'Table of Contacts',
        fields: [
          {
            title: 'Contact',
            value: ', \nBurgess, Randy\nLangley, \nSprat, Jack',
            short: true,
          },
          {
            title: 'Message with /sms',
            value:
              '`+` or `++17735516808`\n`+rbdd` or `++12314567896`\n`+bubba123` or `++17651239876`\n`+jsprat` or `++19587458651`',
            short: true,
          },
        ],
        color: '#0269b7',
      },
    ];

    const message = new MessageFactory({
      id: messageId,
      status: 200,
      type: messageTypes.SLACK_INBOUND,
      requestBody: slackRequest.text,
      validRequest: true,
      archived: false,
      attachments: [],
      tags: [],
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
        body: '',
        id: '',
        name: '',
        status: false,
      },
      apiResponse: {
        status: false,
        body: '',
      },
      slackResponse: {
        as_user: false,
        attachments,
        channel: slackRequest.channel_id,
        link_names: true,
        response_type: slackResponseTypes.EPHEMERAL,
        status: true,
        text: 'Contact List',
        token: slackRequest.token,
        user: slackRequest.user_id,
      },
      smsResponse: {
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
      },
    });

    const asyncContactDirectoryListMock: any = jest.spyOn(Contact, 'renderDirectoryList');
    asyncContactDirectoryListMock.mockResolvedValue(attachments);
    const asyncOperatorMock: any = jest.spyOn(Operator, 'findByValOrCreate');
    asyncOperatorMock.mockResolvedValue(operator);
    const asyncMessageMock: any = jest.spyOn(Message, 'create');
    asyncMessageMock.mockResolvedValue(message);
    const AutoIdMock: any = jest.spyOn(AutoId, 'newId');
    AutoIdMock.mockImplementation(() => messageId);

    return expect(SlackInbound.processMessage({ req: slackRequest, organization })).resolves.toEqual(message);
  });
});
