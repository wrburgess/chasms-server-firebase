import * as faker from 'faker';

class OrganizationFactory {
  id: string;
  name: string;
  usesSlack: boolean;
  slackBotToken: string;
  slackAppWebhook: string;
  slackChannelId: string;
  slackTeamId: string;
  twilioAccountPhoneNumber: string;
  twilioAuthToken: string;
  twilioSid: string;
  channels: Object;

  constructor({
    id = faker.random.uuid(),
    name = faker.company.companyName(),
    usesSlack = true,
    slackBotToken = faker.random.uuid(),
    slackAppWebhook = `https://hooks.slack.com/services/${faker.random.uuid()}`,
    slackChannelId = faker.random.uuid(),
    slackTeamId = faker.random.uuid(),
    twilioAccountPhoneNumber = faker.phone.phoneNumber('+1##########'),
    twilioAuthToken = faker.random.uuid(),
    twilioSid = faker.random.uuid(),
    channels = {},
  }) {
    this.id = id;
    this.name = name;
    this.usesSlack = usesSlack;
    this.slackBotToken = slackBotToken;
    this.slackAppWebhook = slackAppWebhook;
    this.slackChannelId = slackChannelId;
    this.slackTeamId = slackTeamId;
    this.twilioAccountPhoneNumber = twilioAccountPhoneNumber;
    this.twilioAuthToken = twilioAuthToken;
    this.twilioSid = twilioSid;
    this.channels = channels;
  }
}

export default OrganizationFactory;
