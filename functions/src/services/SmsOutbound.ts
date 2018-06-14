import * as functions from 'firebase-functions';
import * as Twilio from 'twilio';

class SmsOutbound {
  service: Twilio = null;
  serviceNumber: string = null;

  constructor() {
    this.service = new Twilio(functions.config().chasms.twilio_sid, functions.config().chasms.twilio_auth_token);
    this.serviceNumber = functions.config().chasms.twilio_account_phone_number;
  }

  async sendMessage(req: any) {
    const message = {
      from: this.serviceNumber,
      to: `1${req.smsNumber}`,
      body: req.body,
    };

    try {
      await this.service.messages.create(message);
    } catch (err) {
      throw err;
    }
  }
}

export default SmsOutbound;
