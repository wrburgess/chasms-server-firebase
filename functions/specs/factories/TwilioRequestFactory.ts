import * as faker from 'faker';

// {
//   ToCountry: 'US',
//   MediaContentType0: 'image/jpeg',
//   ToState: 'KS',
//   SmsMessageSid: 'SMee78795cd6a2fbfcd3962c142ea604a3',
//   NumMedia: '1',
//   ToCity: '',
//   FromZip: '60618',
//   SmsSid: 'SMee78795cd6a2fbfcd3962c142ea604a3',
//   FromState: 'IL',
//   SmsStatus: 'received',
//   FromCity: 'CHICAGO',
//   Body: 'Test 01',
//   FromCountry: 'US',
//   To: '+19132988148',
//   ToZip: '',
//   NumSegments: '1',
//   MessageSid: 'SMee78795cd6a2fbfcd3962c142ea604a3',
//   AccountSid: 'AC777f98cc9160b995bbbd54844a5cc',
//   From: '+17735516808',
//   MediaUrl0: 'https://api.twilio.com/2010-04-01/Accounts/xxxxxxxxx/Messages/xxxxxxxxx/Media/xxxxxxxxx',
//   ApiVersion: '2010-04-01'
// }

class TwilioRequestFactory {
  ToCountry: string;
  MediaContentType0: string;
  ToState: string;
  SmsMessageSid: string;
  NumMedia: string;
  ToCity: string;
  FromZip: string;
  SmsSid: string;
  FromState: string;
  SmsStatus: string;
  FromCity: string;
  Body: string;
  FromCountry: string;
  To: string;
  ToZip: string;
  NumSegments: string;
  MessageSid: string;
  AccountSid: string;
  From: string;
  MediaUrl0: string;
  ApiVersion: string;

  constructor({
    ToCountry = faker.address.countryCode(),
    MediaContentType0 = 'image/jpeg',
    ToState = faker.address.stateAbbr(),
    SmsMessageSid = faker.random.uuid(),
    NumMedia = faker.random.number.toString(),
    ToCity = faker.address.city(),
    FromZip = faker.address.zipCode(),
    SmsSid = faker.random.uuid(),
    FromState = faker.address.stateAbbr(),
    SmsStatus = 'received',
    FromCity = faker.address.city(),
    Body = faker.lorem.sentence(),
    FromCountry = faker.address.countryCode(),
    To = faker.phone.phoneNumber('+1##########'),
    ToZip = faker.address.zipCode(),
    NumSegments = faker.random.number.toString(),
    MessageSid = faker.random.uuid(),
    AccountSid = faker.random.uuid(),
    From = faker.phone.phoneNumber('+1##########'),
    MediaUrl0 = faker.internet.url(),
    ApiVersion = '2010-04-01',
  }) {
    this.ToCountry = ToCountry;
    this.MediaContentType0 = MediaContentType0;
    this.ToState = ToState;
    this.SmsMessageSid = SmsMessageSid;
    this.NumMedia = NumMedia;
    this.ToCity = ToCity;
    this.FromZip = FromZip;
    this.SmsSid = SmsSid;
    this.FromState = FromState;
    this.SmsStatus = SmsStatus;
    this.FromZip = FromZip;
    this.FromCity = FromCity;
    this.Body = Body;
    this.FromCountry = FromCountry;
    this.To = To;
    this.ToZip = ToZip;
    this.NumSegments = NumSegments;
    this.MessageSid = MessageSid;
    this.AccountSid = AccountSid;
    this.From = From;
    this.MediaUrl0 = MediaUrl0;
    this.ApiVersion = ApiVersion;
  }
}

export default TwilioRequestFactory;
