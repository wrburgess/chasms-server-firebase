import User from '../models/User';

class SmsInbound {
  static async processMessage(req: any) {
    const { id } = req.organization;
    const { Body, From, NumMedia } = req.body;
    const sender: any = await User.findByVal({ organizationId: id, field: 'smsNumber', val: From });
    const numAttachments: number = Number(NumMedia);
    const loopCount: number = numAttachments || 1;
    const attachments: Array<any> = [{}];
    let chatText: string = '';

    for (let i = 1; i <= loopCount; i += 1) {
      if (i <= numAttachments) {
        attachments[i] = [{
          fallback: 'Error: Message can not render',
          image_url: eval(`req.body.MediaUrl${i - 1}`),
        }];
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
