import * as faker from 'faker';
import * as messageTypes from '../../src/constants/messageTypes';
import * as sourceTypes from '../../src/constants/sourceTypes';
import * as slackResponseTypes from '../../src/constants/slackResponseTypes';
import * as authorTypes from '../../src/constants/authorTypes';

const contactUsername = faker.internet.userName();
const contactSmsNumber = faker.phone.phoneNumber('+1##########');
const messageBody = faker.lorem.sentence();

let message = {
  id: faker.random.uuid(),
  status: 200,
  type: messageTypes.SLACK_INBOUND,
  requestBody: faker.lorem.sentence,
  validRequest: true,
  archived: false,
  attachments: [],
  tags: [],
  smsInboundNumber: '',
  source: {
    type: sourceTypes.SLACK,
    meta: {},
  },
  author: {
    type: authorTypes.OPERATOR,
    id: faker.random.uuid(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    username: faker.internet.userName,
    completeSmsNumber: faker.phone.phoneNumber('+1##########'),
    email: faker.internet.email,
  },
  organization: {
    id: faker.random.uuid(),
    name: faker.company.companyName(),
  },
  channelResponse: {
    status: true,
    id: faker.random.uuid(),
    name: faker.internet.userName(),
    body: `+${contactUsername} ${messageBody}`,
  },
  apiResponse: {
    status: false,
    body: '',
  },
  slackResponse: {
    body: `+${contactUsername} ${messageBody}`,
    channel_id: faker.internet.userName(),
    response_type: slackResponseTypes.IN_CHANNEL,
    status: true,
    token: faker.random.uuid(),
  },
  smsResponse: {
    body: messageBody,
    completeSmsNumber: contactSmsNumber,
    contact: {},
    status: true,
  },
};

export default message;
