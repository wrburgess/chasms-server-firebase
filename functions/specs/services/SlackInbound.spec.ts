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
import { ContactFactory, OperatorFactory, OrganizationFactory, slackRequest } from '../factories';

describe('services/SlackInbound', () => {
  it('renders the correct Message object from a Slack command with valid Complete SMS Number', () => {
    const channelCompleteSmsNumber = faker.phone.phoneNumber('+1##########');
    const contactCompleteSmsNumber = faker.phone.phoneNumber('+1##########');
    const messageBody = faker.lorem.sentence();
    const messageId = faker.random.uuid();
    const slackMessageBody = `${contactCompleteSmsNumber} ${messageBody}`;
    const operator = new OperatorFactory({});

    slackRequest.channel_id = channelCompleteSmsNumber;
    slackRequest.user_name = operator.slackUserName;
    slackRequest.text = slackMessageBody;

    const contact = new ContactFactory({ completeSmsNumber: contactCompleteSmsNumber });

    const channels = {
      [channelCompleteSmsNumber]: {
        id: 'asdf',
        name: 'asdf',
        completeSmsNumber: channelCompleteSmsNumber,
        type: 'team',
        slackChannelId: slackRequest.channel_id,
      },
    };
    const organization = new OrganizationFactory({
      slackTeamId: slackRequest.team_id,
      twilioAccountPhoneNumber: channelCompleteSmsNumber,
      channels,
    });

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
    const operator = new OperatorFactory({});

    const slackMessageBody = `${contactCommandSmsNumber} ${messageBody}`;

    slackRequest.channel_id = channelCompleteSmsNumber;
    slackRequest.user_name = operator.slackUserName;
    slackRequest.text = slackMessageBody;

    const contact = new ContactFactory({ completeSmsNumber: contactCompleteSmsNumber });

    const channels = {
      [channelCompleteSmsNumber]: {
        id: 'asdf',
        name: 'asdf',
        completeSmsNumber: channelCompleteSmsNumber,
        type: 'team',
        slackChannelId: slackRequest.channel_id,
      },
    };
    const organization = new OrganizationFactory({
      slackTeamId: slackRequest.team_id,
      twilioAccountPhoneNumber: channelCompleteSmsNumber,
      channels,
    });
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
    const operator = new OperatorFactory({});

    const slackMessageBody = `+${contactUsername} ${messageBody}`;

    slackRequest.channel_id = channelCompleteSmsNumber;
    slackRequest.user_name = operator.slackUserName;
    slackRequest.text = slackMessageBody;

    const contact = new ContactFactory({ completeSmsNumber: contactCompleteSmsNumber, username: contactUsername });

    const channels = {
      [channelCompleteSmsNumber]: {
        id: 'asdf',
        name: 'asdf',
        completeSmsNumber: channelCompleteSmsNumber,
        type: 'team',
        slackChannelId: slackRequest.channel_id,
      },
    };
    const organization = new OrganizationFactory({
      slackTeamId: slackRequest.team_id,
      twilioAccountPhoneNumber: channelCompleteSmsNumber,
      channels,
    });
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

  it('renders the correct Message object from a Slack command with an invalid Contact Username', () => {
    const channelCompleteSmsNumber = faker.phone.phoneNumber('+1##########');
    const contactUsername = faker.internet.userName();
    const messageBody = faker.lorem.sentence();
    const messageId = faker.random.uuid();
    const operator = new OperatorFactory({});

    const slackMessageBody = `+${contactUsername} ${messageBody}`;

    slackRequest.channel_id = channelCompleteSmsNumber;
    slackRequest.user_name = operator.slackUserName;
    slackRequest.text = slackMessageBody;

    const channels = {
      [channelCompleteSmsNumber]: {
        id: 'asdf',
        name: 'asdf',
        completeSmsNumber: channelCompleteSmsNumber,
        type: 'team',
        slackChannelId: slackRequest.channel_id,
      },
    };
    const organization = new OrganizationFactory({
      slackTeamId: slackRequest.team_id,
      twilioAccountPhoneNumber: channelCompleteSmsNumber,
      channels,
    });

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
        body: `Unknown username for command: +${contactUsername} ${messageBody}`,
        channel_id: slackRequest.channel_id,
        response_type: slackResponseTypes.EPHEMERAL,
        status: true,
        token: slackRequest.token,
      },
      smsResponse: {
        body: '',
        completeSmsNumber: '',
        contact: {},
        status: false,
      },
    };

    const asyncOperatorMock: any = jest.spyOn(Operator, 'findByVal');
    asyncOperatorMock.mockResolvedValue(operator);
    const asyncMessageMock: any = jest.spyOn(Message, 'create');
    asyncMessageMock.mockResolvedValue(message);
    const asyncContactMock: any = jest.spyOn(Contact, 'findByVal');
    asyncContactMock.mockResolvedValue({});
    const AutoIdMock: any = jest.spyOn(AutoId, 'newId');
    AutoIdMock.mockImplementation(() => messageId);

    return expect(SlackInbound.processMessage({ req: slackRequest, organization })).resolves.toEqual(message);
  });
});
