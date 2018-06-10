const functions = require('firebase-functions');
const User = require('../models/User');

class SmsInbound {
  constructor() {
    this.service_id = functions.config().chasms.twilio_sid;
  }

  authorized(req) {
    return req.body.AccountSid === this.service_id;
  }

  static processMessage(req) {
    const user = new User();

    user.findBySmsNumber(req.body.From)
      .then(sender => {
        const numAttachments = Number(req.body.NumMedia);
        const loopCount = numAttachments || 1;
        let attachments = [{}];

        for (let i = 1; i <= loopCount; i += 1) {
          if (i <= numAttachments) {
            attachments[i] = [{
              fallback: 'Text required for image failure',
              image_url: `req.body.MediaUrl${i - 1}`,
            }];
          }
        }

        let chatText = '';

        if (sender) {
          chatText = `+${sender.username} (sms): ${req.body.Body}`;
        } else {
          chatText = `${req.body.From} (sms): ${req.body.Body}`;
        }

        const payload = {
          status: 200,
          validRequest: true,
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
      })
      .catch(err => {
        console.error('SmsInbound.js > processMessage: ', err);
      });
  }
}

module.exports = SmsInbound;
