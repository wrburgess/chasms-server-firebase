import * as Twilio from 'twilio';

class SmsOutbound {
  service: Twilio = null;
  serviceNumber: string = null;

  constructor(req: any) {
    const { twilioSid, twilioAuthToken, twilioAccountPhoneNumber } = req.organization;

    this.service = new Twilio(twilioSid, twilioAuthToken);
    this.serviceNumber = twilioAccountPhoneNumber;
  }

  async sendMessage(req: any) {
    const { body, smsNumber } = req;
    const message = {
      from: this.serviceNumber,
      to: `1${smsNumber}`,
      body: body,
    };

    try {
      await this.service.messages.create(message);
    } catch (err) {
      throw err;
    }
  }
}

export default SmsOutbound;
