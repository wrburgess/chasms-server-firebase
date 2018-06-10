const keys = require('config').get('keys');
const Twilio = require('twilio');

class SmsOutbound {
  constructor() {
    this.service = new Twilio(keys.TWILIO_SID, keys.TWILIO_AUTH_TOKEN);
    this.serviceNumber = keys.TWILIO_ACCOUNT_PHONE_NUMBER;
  }

  sendMessage(req) {
    const message = {
      from: this.serviceNumber,
      to: `1${req.smsNumber}`,
      body: req.body,
    };

    this.service.messages.create(message)
      .then(() => {
        this.service.messages.create(message);
        return null;
      })
      .catch(err => {
        console.error(err);
      });
  }
}

module.exports = SmsOutbound;
