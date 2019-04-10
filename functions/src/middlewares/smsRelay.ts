import SmsInbound from '../services/SmsInbound';
import Organization from '../models/Organization';

// Twilio request payload
//
// req.body = {
//   ToCountry: 'US',
//   ToState: 'KS',
//   SmsMessageSid: 'SMee78795cd6a2fbfcd3962c142ea604a3',
//   NumMedia: '0',
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
//   AccountSid: 'AC777f98cc9160b995bbbd54844a5cc,
//   From: '+17735516808',
//   MediaUrl0: 'https://api.twilio.com/2010-04-01/Accounts/AC777f98cc9160b995bbbd54844a5cc490/Messages/MMf3f740fb5905833b5cd277f01ddbe30a/Media/MEf03cce59d646ac43e9a7707801b21f31',
//   ApiVersion: '2010-04-01'
// }

const smsRelay = async (req, _, next) => {
  try {
    const { AccountSid, To } = req.body;
    const organization: any = await Organization.findByVal({
      field: 'twilioSid',
      val: AccountSid,
    });
    const channelId: string = To.substring(1); // remove leading +

    if (organization && organization.channels[channelId]) {
      req.chasms = await SmsInbound.processMessage({ req, organization });
      next();
    } else {
      req.chasms = { status: 403 };
      next();
    }
  } catch (err) {
    req.chasms = { status: 403 };
    console.error('chasms > smsRelay: ', err);
    next();
  }
};

export default smsRelay;
