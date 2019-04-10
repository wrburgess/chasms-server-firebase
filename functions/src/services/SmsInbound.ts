import Contact from '../models/Contact';
import Message from '../models/Message';

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

class SmsInbound {
  static async processMessage({ req, organization }) {
    const { Body, To, From, NumMedia } = req.body;

    const channelId: string = To.substring(1); // remove leading +
    const contactId: string = From.substring(1); // remove leading +
    const contact: any = await Contact.findById({
      organizationId: organization.id,
      contactId,
    });

    const attachmentsCount: number = Number(NumMedia);
    const attachments: Array<any> = [];
    let chatText: string = '';

    if (attachmentsCount > 0) {
      for (let i = 0; i < attachmentsCount; i += 1) {
        attachments.push({
          fallback: 'Error: Message can not render',
          image_url: req.body[`MediaUrl${i}`],
          color: '#3AA3E3',
        });
      }
    }

    if (contact) {
      chatText = `+${contact.username} (sms): ${Body}`;
    } else {
      chatText = `${From} (sms): ${Body}`;
    }

    const payload = {
      organizationId: id,
      status: 200,
      validRequest: true,
      sendSms: false,
      messageType: 'smsInbound',
      attachments,
      chatResponse: {
        response_type: 'in_channel',
        text: chatText,
      },
      smsResponse: {
        smsNumber: null,
        body: null,
      },
    };

    Message.create(payload);

    return payload;
  }
}

export default SmsInbound;
