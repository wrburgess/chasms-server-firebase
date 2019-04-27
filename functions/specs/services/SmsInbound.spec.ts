import * as faker from 'faker';
import * as messageTypes from '../../src/constants/messageTypes';
import * as sourceTypes from '../../src/constants/sourceTypes';
import * as slackResponseTypes from '../../src/constants/slackResponseTypes';
import * as authorTypes from '../../src/constants/authorTypes';
import SmsInbound from '../../src/services/SmsInbound';
import Message from '../../src/models/Message';
import Contact from '../../src/models/Contact';
import AutoId from '../../src/utilities/AutoId';
import {
  ChannelFactory,
  ContactFactory,
  MessageFactory,
  OrganizationFactory,
  TwilioRequestFactory,
} from '../factories';

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

    const organization = new OrganizationFactory({});

    const channel = new ChannelFactory({
      twilioAccountPhoneNumber: channelCompleteSmsNumber,
    });

    organization.channels[channel.id] = channel;

    const message = new MessageFactory({
      id: messageId,
      status: 200,
      type: messageTypes.TWILIO_INBOUND,
      requestBody: twilioRequest.Body,
      validRequest: true,
      archived: false,
      attachments: [],
      tags: [],
      source: {
        type: sourceTypes.TWILIO,
        meta: {
          ...twilioRequest,
        },
      },
      author: {
        completeSmsNumber: contact.completeSmsNumber,
        email: '',
        firstName: contact.firstName,
        id: contact.id,
        lastName: contact.lastName,
        type: authorTypes.CONTACT,
        username: contact.username,
      },
      organization: {
        id: organization.id,
        name: organization.name,
      },
      channelResponse: {
        body: formattedMessageBody,
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
        channel: channel.slackChannelId,
        link_names: true,
        response_type: slackResponseTypes.IN_CHANNEL,
        status: true,
        text: formattedMessageBody,
        token: channel.slackBotToken,
        user: '',
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

    const organization = new OrganizationFactory({});

    const channel = new ChannelFactory({
      twilioAccountPhoneNumber: channelCompleteSmsNumber,
    });

    organization.channels[channel.id] = channel;

    const message = new MessageFactory({
      id: messageId,
      status: 200,
      type: messageTypes.TWILIO_INBOUND,
      requestBody: twilioRequest.Body,
      validRequest: true,
      archived: false,
      attachments: [],
      tags: [],
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
        email: '',
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
        as_user: false,
        attachments: [],
        channel: channel.slackChannelId,
        link_names: true,
        response_type: slackResponseTypes.IN_CHANNEL,
        status: true,
        text: formattedMessageBody,
        token: channel.slackBotToken,
        user: '',
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

    const asyncMessageMock: any = jest.spyOn(Message, 'create');
    asyncMessageMock.mockResolvedValue(message);
    const asyncContactMock: any = jest.spyOn(Contact, 'findByValOrCreate');
    asyncContactMock.mockResolvedValue(contact);
    const AutoIdMock: any = jest.spyOn(AutoId, 'newId');
    AutoIdMock.mockImplementation(() => messageId);

    return expect(SmsInbound.processRequest({ req: twilioRequest, organization })).resolves.toEqual(message);
  });

  it('renders the correct Message object from a Twilio with media attachments', () => {
    const channelCompleteSmsNumber = faker.phone.phoneNumber('+1##########');
    const contactCompleteSmsNumber = faker.phone.phoneNumber('+1##########');
    const messageBody = faker.lorem.sentence();
    const messageId = faker.random.uuid();

    const mediaUrl = `https://api.twilio.com/2010-04-01/Accounts/${faker.random.uuid()}/Messages/${faker.random.uuid()}/Media/${faker.random.uuid()}`;
    const twilioRequest = new TwilioRequestFactory({
      From: contactCompleteSmsNumber,
      To: channelCompleteSmsNumber,
      Body: messageBody,
      MediaUrl0: mediaUrl,
      NumSegments: '1',
      NumMedia: '1',
      MediaContentType0: 'image/jpeg',
    });

    const contact = new ContactFactory({
      completeSmsNumber: contactCompleteSmsNumber,
      firstName: '',
      lastName: '',
      username: '',
    });

    const formattedMessageBody = `${contact.completeSmsNumber} (sms): ${messageBody}`;

    const organization = new OrganizationFactory({});

    const channel = new ChannelFactory({
      twilioAccountPhoneNumber: channelCompleteSmsNumber,
    });

    organization.channels[channel.id] = channel;

    const message = new MessageFactory({
      id: messageId,
      status: 200,
      type: messageTypes.TWILIO_INBOUND,
      requestBody: twilioRequest.Body,
      validRequest: true,
      archived: false,
      attachments: [
        {
          color: '#3AA3E3',
          fallback: 'Error: Message can not render',
          image_url: mediaUrl,
        },
      ],
      tags: [],
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
        email: '',
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
        as_user: false,
        attachments: [
          {
            color: '#3AA3E3',
            fallback: 'Error: Message can not render',
            image_url: mediaUrl,
          },
        ],
        channel: channel.slackChannelId,
        link_names: true,
        response_type: slackResponseTypes.IN_CHANNEL,
        status: true,
        text: formattedMessageBody,
        token: channel.slackBotToken,
        user: '',
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

    const organization = new OrganizationFactory({});

    const channel = new ChannelFactory({
      twilioAccountPhoneNumber: channelCompleteSmsNumber,
      usesSlack: false,
    });

    organization.channels[channel.id] = channel;

    const message = new MessageFactory({
      id: messageId,
      status: 200,
      type: messageTypes.TWILIO_INBOUND,
      requestBody: twilioRequest.Body,
      validRequest: true,
      archived: false,
      attachments: [],
      tags: [],
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
        email: '',
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
        as_user: false,
        attachments: [],
        channel: '',
        link_names: true,
        response_type: '',
        status: false,
        text: '',
        token: '',
        user: '',
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

    const asyncMessageMock: any = jest.spyOn(Message, 'create');
    asyncMessageMock.mockResolvedValue(message);
    const asyncContactMock: any = jest.spyOn(Contact, 'findByValOrCreate');
    asyncContactMock.mockResolvedValue(contact);
    const AutoIdMock: any = jest.spyOn(AutoId, 'newId');
    AutoIdMock.mockImplementation(() => messageId);

    return expect(SmsInbound.processRequest({ req: twilioRequest, organization })).resolves.toEqual(message);
  });
});
