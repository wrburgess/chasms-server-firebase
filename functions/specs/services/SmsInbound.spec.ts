import * as faker from 'faker';
import * as messageTypes from '../../src/constants/messageTypes';
import * as sourceTypes from '../../src/constants/sourceTypes';
import * as slackResponseTypes from '../../src/constants/slackResponseTypes';
import * as authorTypes from '../../src/constants/authorTypes';
import SmsInbound from '../../src/services/SmsInbound';
import Message from '../../src/models/Message';
import Contact from '../../src/models/Contact';
import AutoId from '../../src/utilities/AutoId';
import { ContactFactory, OrganizationFactory, TwilioRequestFactory } from '../factories';

describe('services/SmsInbound', () => {
  it('renders the correct Message object from a Twilio request from known Contact', () => {
    const channelCompleteSmsNumber = faker.phone.phoneNumber('+1##########');
    const contactCompleteSmsNumber = faker.phone.phoneNumber('+1##########');
    const messageBody = faker.lorem.sentence();
    const messageId = faker.random.uuid();

    const twilioRequest = new TwilioRequestFactory({
      From: contactCompleteSmsNumber,
      To: channelCompleteSmsNumber,
      Body: messageBody,
    });

    const contact = new ContactFactory({ completeSmsNumber: contactCompleteSmsNumber });
    const formattedMessageBody = `+${contact.username} (sms): ${messageBody}`;

    const channels = {
      [channelCompleteSmsNumber]: {
        id: channelCompleteSmsNumber,
        name: faker.internet.userName(),
        completeSmsNumber: channelCompleteSmsNumber,
        type: 'team',
        slackChannelId: faker.random.uuid(),
      },
    };
    const organization = new OrganizationFactory({
      twilioAccountPhoneNumber: channelCompleteSmsNumber,
      channels,
    });

    const channel = organization.channels[channelCompleteSmsNumber];

    const message = {
      id: messageId,
      status: 200,
      type: messageTypes.TWILIO_INBOUND,
      requestBody: twilioRequest.Body,
      validRequest: true,
      archived: false,
      attachments: [],
      tags: [],
      smsInboundNumber: channelCompleteSmsNumber,
      source: {
        type: sourceTypes.TWILIO,
        meta: {
          ...twilioRequest,
        },
      },
      author: {
        type: authorTypes.CONTACT,
        id: contact.id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        username: contact.username,
        completeSmsNumber: contact.completeSmsNumber,
      },
      organization: {
        id: organization.id,
        name: organization.name,
      },
      channelResponse: {
        status: true,
        id: channel.id,
        name: channel.name,
        body: formattedMessageBody,
      },
      apiResponse: {
        status: false,
        body: '',
      },
      slackResponse: {
        body: formattedMessageBody,
        channel_id: organization.slackChannelId,
        response_type: slackResponseTypes.IN_CHANNEL,
        status: true,
        token: organization.slackBotToken,
      },
      smsResponse: {
        body: '',
        completeSmsNumber: '',
        contact: {},
        status: false,
        twilioAccountPhoneNumber: channel.twilioAccountPhoneNumber,
        twilioAuthToken: channel.twilioAuthToken,
        twilioSid: channel.twilioSid,
      },
    };

    const asyncMessageMock: any = jest.spyOn(Message, 'create');
    asyncMessageMock.mockResolvedValue(message);
    const asyncContactMock: any = jest.spyOn(Contact, 'findByValOrCreate');
    asyncContactMock.mockResolvedValue(contact);
    const AutoIdMock: any = jest.spyOn(AutoId, 'newId');
    AutoIdMock.mockImplementation(() => messageId);

    return expect(SmsInbound.processRequest({ req: twilioRequest, organization })).resolves.toEqual(message);
  });

  it('renders the correct Message object from a Twilio request from new Contact', () => {
    const channelCompleteSmsNumber = faker.phone.phoneNumber('+1##########');
    const contactCompleteSmsNumber = faker.phone.phoneNumber('+1##########');
    const messageBody = faker.lorem.sentence();
    const messageId = faker.random.uuid();

    const twilioRequest = new TwilioRequestFactory({
      From: contactCompleteSmsNumber,
      To: channelCompleteSmsNumber,
      Body: messageBody,
    });

    const contact = new ContactFactory({
      completeSmsNumber: contactCompleteSmsNumber,
      firstName: '',
      lastName: '',
      username: '',
    });

    const formattedMessageBody = `${contact.completeSmsNumber} (sms): ${messageBody}`;

    const channels = {
      [channelCompleteSmsNumber]: {
        id: channelCompleteSmsNumber,
        name: faker.internet.userName(),
        completeSmsNumber: channelCompleteSmsNumber,
        type: 'team',
        slackChannelId: faker.random.uuid(),
      },
    };
    const organization = new OrganizationFactory({
      twilioAccountPhoneNumber: channelCompleteSmsNumber,
      channels,
    });

    const channel = organization.channels[channelCompleteSmsNumber];

    const message = {
      id: messageId,
      status: 200,
      type: messageTypes.TWILIO_INBOUND,
      requestBody: twilioRequest.Body,
      validRequest: true,
      archived: false,
      attachments: [],
      tags: [],
      smsInboundNumber: channelCompleteSmsNumber,
      source: {
        type: sourceTypes.TWILIO,
        meta: {
          ...twilioRequest,
        },
      },
      author: {
        type: authorTypes.CONTACT,
        id: contact.id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        username: contact.username,
        completeSmsNumber: contact.completeSmsNumber,
      },
      organization: {
        id: organization.id,
        name: organization.name,
      },
      channelResponse: {
        status: true,
        id: channel.id,
        name: channel.name,
        body: formattedMessageBody,
      },
      apiResponse: {
        status: false,
        body: '',
      },
      slackResponse: {
        body: formattedMessageBody,
        channel_id: organization.slackChannelId,
        response_type: slackResponseTypes.IN_CHANNEL,
        status: true,
        token: organization.slackBotToken,
      },
      smsResponse: {
        body: '',
        completeSmsNumber: '',
        contact: {},
        status: false,
      },
    };

    const asyncMessageMock: any = jest.spyOn(Message, 'create');
    asyncMessageMock.mockResolvedValue(message);
    const asyncContactMock: any = jest.spyOn(Contact, 'findByValOrCreate');
    asyncContactMock.mockResolvedValue(contact);
    const AutoIdMock: any = jest.spyOn(AutoId, 'newId');
    AutoIdMock.mockImplementation(() => messageId);

    return expect(SmsInbound.processRequest({ req: twilioRequest, organization })).resolves.toEqual(message);
  });

  it('renders the correct Message object from a Twilio request for Organization without Slack', () => {
    const channelCompleteSmsNumber = faker.phone.phoneNumber('+1##########');
    const contactCompleteSmsNumber = faker.phone.phoneNumber('+1##########');
    const messageBody = faker.lorem.sentence();
    const messageId = faker.random.uuid();

    const twilioRequest = new TwilioRequestFactory({
      From: contactCompleteSmsNumber,
      To: channelCompleteSmsNumber,
      Body: messageBody,
    });

    const contact = new ContactFactory({
      completeSmsNumber: contactCompleteSmsNumber,
      firstName: '',
      lastName: '',
      username: '',
    });

    const formattedMessageBody = `${contact.completeSmsNumber} (sms): ${messageBody}`;

    const channels = {
      [channelCompleteSmsNumber]: {
        id: channelCompleteSmsNumber,
        name: faker.internet.userName(),
        completeSmsNumber: channelCompleteSmsNumber,
        type: 'team',
      },
    };
    const organization = new OrganizationFactory({
      usesSlack: false,
      twilioAccountPhoneNumber: channelCompleteSmsNumber,
      channels,
    });

    const channel = organization.channels[channelCompleteSmsNumber];

    const message = {
      id: messageId,
      status: 200,
      type: messageTypes.TWILIO_INBOUND,
      requestBody: twilioRequest.Body,
      validRequest: true,
      archived: false,
      attachments: [],
      tags: [],
      smsInboundNumber: channelCompleteSmsNumber,
      source: {
        type: sourceTypes.TWILIO,
        meta: {
          ...twilioRequest,
        },
      },
      author: {
        type: authorTypes.CONTACT,
        id: contact.id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        username: contact.username,
        completeSmsNumber: contact.completeSmsNumber,
      },
      organization: {
        id: organization.id,
        name: organization.name,
      },
      channelResponse: {
        status: true,
        id: channel.id,
        name: channel.name,
        body: formattedMessageBody,
      },
      apiResponse: {
        status: false,
        body: '',
      },
      slackResponse: {
        body: '',
        channel_id: '',
        response_type: '',
        status: false,
        token: '',
      },
      smsResponse: {
        body: '',
        completeSmsNumber: '',
        contact: {},
        status: false,
      },
    };

    const asyncMessageMock: any = jest.spyOn(Message, 'create');
    asyncMessageMock.mockResolvedValue(message);
    const asyncContactMock: any = jest.spyOn(Contact, 'findByValOrCreate');
    asyncContactMock.mockResolvedValue(contact);
    const AutoIdMock: any = jest.spyOn(AutoId, 'newId');
    AutoIdMock.mockImplementation(() => messageId);

    return expect(SmsInbound.processRequest({ req: twilioRequest, organization })).resolves.toEqual(message);
  });
});
