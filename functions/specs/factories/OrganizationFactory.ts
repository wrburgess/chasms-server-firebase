import * as faker from 'faker';

class OrganizationFactory {
  id: string;
  name: string;
  channels: Object;
  slackChannelIds: string[];
  twilioAccountPhoneNumbers: string[];

  constructor({
    id = faker.random.uuid(),
    name = faker.company.companyName(),
    channels = {},
    slackChannelIds = [],
    twilioAccountPhoneNumbers = [],
  }) {
    this.id = id;
    this.name = name;
    this.channels = channels;
    this.slackChannelIds = slackChannelIds;
    this.twilioAccountPhoneNumbers = twilioAccountPhoneNumbers;
  }
}

export default OrganizationFactory;
