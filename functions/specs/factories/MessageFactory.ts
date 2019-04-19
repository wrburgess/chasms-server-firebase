import * as faker from 'faker';
import * as messageTypes from '../../src/constants/messageTypes';
import * as sourceTypes from '../../src/constants/sourceTypes';
import * as slackResponseTypes from '../../src/constants/slackResponseTypes';
import * as authorTypes from '../../src/constants/authorTypes';

const contactUsername = faker.internet.userName();
const messageBody = faker.lorem.sentence();

class MessageFactory {
  id: string;
  status: number;
  type: string;
  requestBody: string;
  validRequest: boolean;
  archived: boolean;
  attachments: Array<string>;
  tags: Array<string>;
  source: Object;
  author: Object;
  organization: Object;
  channelResponse: Object;
  apiResponse: Object;
  slackResponse: Object;
  smsResponse: Object;

  constructor({
    id = faker.random.uuid(),
    status = 200,
    type = messageTypes.SLACK_INBOUND,
    requestBody = faker.lorem.sentence(),
    validRequest = true,
    archived = false,
    attachments = [],
    tags = [],
    source = {
      type: sourceTypes.SLACK,
      meta: {},
    },
    author = {
      type: authorTypes.OPERATOR,
      id: faker.random.uuid(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      username: faker.internet.userName(),
      completeSmsNumber: faker.phone.phoneNumber('+1##########'),
      email: faker.internet.email(),
    },
    organization = {
      id: faker.random.uuid(),
      name: faker.company.companyName(),
    },
    channelResponse = {
      status: true,
      id: faker.random.uuid(),
      name: faker.internet.userName(),
      body: `+${contactUsername} ${messageBody}`,
    },
    apiResponse = {
      status: false,
      body: '',
    },
    slackResponse = {
      as_user: false,
      attachments: [],
      channel: faker.internet.userName(),
      link_names: true,
      response_type: slackResponseTypes.IN_CHANNEL,
      status: true,
      text: `+${contactUsername} ${messageBody}`,
      token: faker.random.uuid(),
      user: faker.random.uuid(),
    },
    smsResponse = {
      body: messageBody,
      contact: {
        id: faker.random.uuid(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        completeSmsNumber: faker.phone.phoneNumber('+1##########'),
        username: faker.internet.userName(),
      },
      status: true,
      twilioAccountPhoneNumber: faker.phone.phoneNumber('+1##########'),
      twilioAuthToken: faker.random.uuid(),
      twilioSid: faker.random.uuid(),
    },
  }) {
    this.id = id;
    this.status = status;
    this.type = type;
    this.requestBody = requestBody;
    this.validRequest = validRequest;
    this.archived = archived;
    this.attachments = attachments;
    this.tags = tags;
    this.source = source;
    this.author = author;
    this.organization = organization;
    this.channelResponse = channelResponse;
    this.apiResponse = apiResponse;
    this.slackResponse = slackResponse;
    this.smsResponse = smsResponse;
  }
}

export default MessageFactory;
