import * as Twilio from 'twilio';

class SmsOutbound {
  static async sendMessage(smsResponse: any) {
    try {
      const { body, contact, twilioAccountPhoneNumber, twilioAuthToken, twilioSid } = smsResponse;
      const twilio = Twilio(twilioSid, twilioAuthToken);

      const message = {
        from: twilioAccountPhoneNumber,
        to: contact.completeSmsNumber,
        body: body,
      };

      await twilio.messages.create(message);
    } catch (err) {
      console.error('SmsOutbound > sendMessage:', err);
    }
  }
}

export default SmsOutbound;
