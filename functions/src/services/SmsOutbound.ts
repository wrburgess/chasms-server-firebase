import * as functions from 'firebase-functions';
import * as Twilio from 'twilio';

class SmsOutbound {
  service: Twilio = null;
  serviceNumber: string = null;

  constructor(req: any) {
    const { twilioSid, twilioAuthToken, twilioAccountPhoneNumber } = req.chasms.organization;

    this.service = new Twilio(twilioSid, twilioAuthToken);
    this.serviceNumber = twilioAccountPhoneNumber;
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
