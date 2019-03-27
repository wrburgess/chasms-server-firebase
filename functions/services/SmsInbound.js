import Contact from "../models/Contact";
import Message from "../models/Message";

class SmsInbound {
  static async processMessage(req) {
    const { id } = req.organization;
    const { Body, From, NumMedia } = req.body;

    const smsNumber = From.substring(2); // remove leading +1
    const sender = await Contact.findByVal({
      organizationId: id,
      field: "smsNumber",
      val: smsNumber
    });
    const attachmentsCount = Number(NumMedia);
    const attachments = [];
    let chatText = "";

    if (attachmentsCount > 0) {
      for (let i = 0; i < attachmentsCount; i += 1) {
        attachments.push({
          fallback: "Error: Message can not render",
          image_url: req.body[`MediaUrl${i}`],
          color: "#3AA3E3"
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
      messageType: "smsInbound",
      attachments,
      chatResponse: {
        response_type: "in_channel",
        text: chatText
      },
      smsResponse: {
        smsNumber: null,
        body: null
      }
    };

    Message.create(payload);

    return payload;
  }
}

export default SmsInbound;
