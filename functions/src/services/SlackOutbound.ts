import axios from 'axios';

import { SLACK_EPHEMERAL_MESSAGE_URI, SLACK_PUBLIC_MESSAGE_URI } from '../constants/config';

class SlackOutbound {
  static async sendPublicMessage(slackResponse: any) {
    try {
      const config = {
        headers: { Authorization: `Bearer ${slackResponse.token}` },
      };

      await axios.post(
        SLACK_PUBLIC_MESSAGE_URI,
        {
          ...slackResponse,
        },
        config,
      );
    } catch (err) {
      console.error('SlackOutbound > sendPublicMessage: ', err);
    }
  }

  static async sendEphemeralMessage(slackResponse: any) {
    try {
      const config = {
        headers: { Authorization: `Bearer ${slackResponse.token}` },
      };

      await axios.post(
        SLACK_EPHEMERAL_MESSAGE_URI,
        {
          ...slackResponse,
        },
        config,
      );
    } catch (err) {
      console.error('SlackOutbound > sendEphemeralMessage: ', err);
    }
  }
}

export default SlackOutbound;
