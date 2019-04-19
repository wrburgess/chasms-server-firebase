import * as faker from 'faker';

class ChannelFactory {
  id: string;
  name: string;
  slackAppWebhook: string;
  slackBotToken: string;
  slackChannelId: string;
  slackTeamId: string;
  twilioAccountPhoneNumber: string;
  twilioAuthToken: string;
  twilioSid: string;
  type: string;
  usesSlack: boolean;
  usesTwilio: boolean;

  constructor({
    id = faker.random.uuid(),
    name = faker.internet.userName(),
    slackAppWebhook = faker.internet.url(),
    slackBotToken = faker.random.uuid(),
    slackChannelId = faker.random.uuid(),
    slackTeamId = faker.random.uuid(),
    twilioAccountPhoneNumber = faker.phone.phoneNumber('+1##########'),
    twilioAuthToken = faker.random.uuid(),
    twilioSid = faker.random.uuid(),
    type = 'team',
    usesSlack = true,
    usesTwilio = true,
  }) {
    this.id = id;
    this.name = name;
    this.slackAppWebhook = slackAppWebhook;
    this.slackBotToken = slackBotToken;
    this.slackChannelId = slackChannelId;
    this.slackTeamId = slackTeamId;
    this.twilioAccountPhoneNumber = twilioAccountPhoneNumber;
    this.twilioAuthToken = twilioAuthToken;
    this.twilioSid = twilioSid;
    this.type = type;
    this.usesSlack = usesSlack;
    this.usesTwilio = usesTwilio;
  }
}

export default ChannelFactory;
