import axios from 'axios';

import { SLACK_EPHEMERAL_MESSAGE_URI, SLACK_PUBLIC_MESSAGE_URI } from '../constants/config';

class SlackOutbound {
  static async sendPublicMessage(slackResponse: any) {
    try {
      const config = {
        headers: { Authorization: `Bearer ${slackResponse.token}` },
      };

      const response = await axios.post(
        SLACK_PUBLIC_MESSAGE_URI,
        {
          ...slackResponse,
        },
        config,
      );

      console.log('axios response', response);
    } catch (err) {
      console.error('SlackOutbound > sendPublicMessage: ', err);
    }
  }

  static async sendEphemeralMessage(slackResponse: any) {
    try {
      const config = {
        headers: { Authorization: `Bearer ${slackResponse.token}` },
      };

      const payload = {
        ...slackResponse,
      };

      axios.post(SLACK_EPHEMERAL_MESSAGE_URI, payload, config);
    } catch (err) {
      console.error('SlackOutbound > sendEphemeralMessage: ', err);
    }
  }
}

export default SlackOutbound;
