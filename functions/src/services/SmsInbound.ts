import Contact from '../models/Contact';
import Message from '../models/Message';

class SmsInbound {
  static async processMessage(req: any) {
    const { id } = req.organization;
    const { Body, From, NumMedia } = req.body;

    const smsNumber: string = From.substring(2); // remove leading +1
    const sender: any = await Contact.findByVal({ organizationId: id, field: 'smsNumber', val: smsNumber });
    const attachmentsCount: number = Number(NumMedia);
    const attachments: Array<any> = [];
    let chatText: string = '';

    if (attachmentsCount > 0) {
      for (let i = 0; i < attachmentsCount; i += 1) {
        attachments.push({
          fallback: 'Error: Message can not render',
          image_url: req.body[`MediaUrl${i}`],
        });
      }
    }

    if (sender) {
      chatText = `+${sender.username} (sms): ${Body}`;
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
