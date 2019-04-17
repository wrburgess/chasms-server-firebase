import * as Twilio from 'twilio';

class SmsOutbound {
  static async sendMessage(message: any) {
    try {
      const { body, completeSmsNumber, twilioAccountPhoneNumber, twilioAuthToken, twilioSid } = message.smsResponse;

      const twilio = Twilio(twilioSid, twilioAuthToken);

      const message = {
        from: twilioAccountPhoneNumber,
        to: completeSmsNumber,
        body: body,
      };

      await twilio.messages.create(message);
    } catch (err) {
      console.error('SmsOutbound > sendMessage:', err);
    }
  }
}

export default SmsOutbound;
