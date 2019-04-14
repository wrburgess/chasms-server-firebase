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

describe('services/SlackInbound', () => {
  it('render the correct Message object from a Slack command with Complete SMS Number', () => {
    const channelSmsNumber1 = faker.phone.phoneNumber('+1##########');
    const channelSmsNumber2 = faker.phone.phoneNumber('+1##########');
    const messageBody = faker.lorem.sentence();
    const contactSmsNumber = faker.phone.phoneNumber('+1##########');
    const messageId = faker.random.uuid();

    const contact = {
      id: faker.random.uuid(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      username: faker.internet.userName(),
      completeSmsNumber: contactSmsNumber,
    };

    const slackMessageBody = `${contact.completeSmsNumber} ${messageBody}`;

    const operator = {
      id: faker.random.uuid(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      username: faker.internet.userName(),
      completeSmsNumber: faker.phone.phoneNumber('+1#########'),
      email: faker.internet.email,
      slackUserName: faker.internet.userName(),
    };

    const slackRequest = {
      token: faker.random.uuid(),
      team_id: faker.random.uuid(),
      team_domain: faker.internet.userName(),
      channel_id: channelSmsNumber1,
      channel_name: 'privategroup',
      user_id: faker.random.uuid(),
      user_name: operator.slackUserName,
      command: '/sms',
      text: slackMessageBody,
      response_url: `https://hooks.slack.com/commands/${faker.random.uuid()}`,
      trigger_id: faker.random.uuid(),
    };

    const organization = {
      id: faker.random.uuid(),
      name: faker.company.companyName(),
      usesSlack: true,
      slackBotToken: faker.random.uuid(),
      slackAppWebhook: `https://hooks.slack.com/services/${faker.random.uuid()}`,
      slackChannelId: faker.random.uuid(),
      slackTeamId: slackRequest.team_id,
      twilioAccountPhoneNumber: channelSmsNumber2,
      twilioAuthToken: faker.random.uuid(),
      twilioSid: faker.random.uuid(),
      channels: {
        [channelSmsNumber1]: {
          id: 'asdf',
          name: 'asdf',
          completeSmsNumber: channelSmsNumber1,
          type: 'team',
          slackChannelId: slackRequest.channel_id,
        },
        [channelSmsNumber2]: {
          id: 'asdf',
          name: 'asdf',
          completeSmsNumber: channelSmsNumber2,
          type: 'team',
          slackChannelId: faker.random.uuid(),
        },
      },
    };

    const channel = organization.channels[channelSmsNumber1];

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
});
