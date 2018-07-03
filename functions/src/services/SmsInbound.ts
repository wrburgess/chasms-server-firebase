import User from '../models/User';

class SmsInbound {
  serviceId: string = null;

  constructor(req) {
    const { twilioSid } = req.chasms.organization;
    this.serviceId = twilioSid;
  }

  authorized(req) {
    return req.body.AccountSid === this.serviceId;
  }

  static async processMessage(req: any) {
    const sender: any = await User.findByVal({ field: 'smsNumber', val: req.body.From });
    const numAttachments: number = Number(req.body.NumMedia);
    const loopCount: number = numAttachments || 1;
    const attachments: Array<any> = [{}];

    for (let i = 1; i <= loopCount; i += 1) {
      if (i <= numAttachments) {
        attachments[i] = [{
          fallback: 'Error: Message can not render',
          image_url: eval(`req.body.MediaUrl${i - 1}`),
        }];
      }
    }

    let chatText: string = '';

    if (sender) {
      chatText = `+${sender.username} (sms): ${req.body.Body}`;
    } else {
      chatText = `${req.body.From} (sms): ${req.body.Body}`;
    }

    const payload = {
      status: 200,
      validRequest: true,
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

    return payload;
  }
}

export default SmsInbound;
