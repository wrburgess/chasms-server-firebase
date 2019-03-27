import * as Twilio from 'twilio';

class SmsOutbound {
  static async sendMessage(req: any) {
    try {
      const { twilioSid, twilioAuthToken, twilioAccountPhoneNumber } = req.organization;
      const twilio = new Twilio(twilioSid, twilioAuthToken);
      const { body, smsNumber } = req.chasms.smsResponse;
      const message = {
        from: twilioAccountPhoneNumber,
        to: `1${smsNumber}`,
        body: body,
      };

      await twilio.messages.create(message);
    } catch (err) {
      console.error('SmsOutbound > sendMessage:', err);
    }
  }
}

export default SmsOutbound;
