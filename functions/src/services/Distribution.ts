import SlackOutbound from '../services/SlackOutbound';
import SmsOutbound from '../services/SmsOutbound';
import * as slackResponseTypes from '../constants/slackResponseTypes';

class Distribution {
  static processMessage(message: any) {
    if (message && message.smsResponse.status) {
      SmsOutbound.sendMessage(message.smsResponse);
    }

    if (message && message.slackResponse.status) {
      if (message.slackResponse.response_type === slackResponseTypes.EPHEMERAL) {
        SlackOutbound.sendEphemeralMessage(message.slackResponse);
      } else if (message.slackResponse.response_type === slackResponseTypes.IN_CHANNEL) {
        SlackOutbound.sendPublicMessage(message.slackResponse);
      }
    }
  }
}

export default Distribution;
