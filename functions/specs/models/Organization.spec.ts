import * as faker from 'faker';
import { OrganizationFactory, ChannelFactory } from '../factories';
import Organization from '../../src/models/Organization';

describe('models/Organization', () => {
  it('returns the correct channel given a slackChannelID', () => {
    const slackChannelId = faker.random.uuid();
    const organization = new OrganizationFactory({});
    const channel = new ChannelFactory({ slackChannelId });

    organization.channels[channel.id] = channel;
    organization.slackChannelIds.push[slackChannelId];

    const orgChannel = Organization.channelFindByVal({
      organization,
      field: 'slackChannelId',
      val: slackChannelId,
    });

    expect(orgChannel).toEqual(channel);
  });

  it('returns the correct channel given a twilioAccountPhoneNumber', () => {
    const twilioAccountPhoneNumber = faker.phone.phoneNumber('+1##########');
    const organization = new OrganizationFactory({});
    const channel = new ChannelFactory({ twilioAccountPhoneNumber });

    organization.channels[channel.id] = channel;
    organization.twilioAccountPhoneNumbers.push[twilioAccountPhoneNumber];

    const orgChannel = Organization.channelFindByVal({
      organization,
      field: 'twilioAccountPhoneNumber',
      val: twilioAccountPhoneNumber,
    });

    expect(orgChannel).toEqual(channel);
  });
});
