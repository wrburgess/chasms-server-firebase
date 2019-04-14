import * as faker from 'faker';

let organization = {
  id: faker.random.uuid(),
  name: faker.company.companyName(),
  usesSlack: true,
  slackBotToken: faker.random.uuid(),
  slackAppWebhook: `https://hooks.slack.com/services/${faker.random.uuid()}`,
  slackChannelId: faker.random.uuid(),
  slackTeamId: faker.random.uuid(),
  twilioAccountPhoneNumber: faker.phone.phoneNumber('+1##########'),
  twilioAuthToken: faker.random.uuid(),
  twilioSid: faker.random.uuid(),
  channels: {},
};

export default organization;
