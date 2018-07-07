import axios from 'axios';

import { SLACK_EPHEMERAL_MESSAGE_URI, SLACK_PUBLIC_MESSAGE_URI } from '../constants/config';

class SlackOutbound {
  static async sendWebhookMessage(req: any) {
    try {
      const { slackAppWebhook } = req.organization;
      const { attachments, chatResponse } = req.chasms;
      const axiosArray = [];

      if (attachments.length > 0) {
        chatResponse.attachments = [];

        for (const attachment of attachments) {
          if (attachment) {
            chatResponse.attachments.push(attachment);
          }

          const axiosPromise = await axios({ // eslint-disable-line no-await-in-loop
            data: chatResponse,
            method: 'post',
            url: slackAppWebhook,
          });

          axiosArray.push(axiosPromise);
        }
      } else {
        const axiosPromise = await axios({
          data: chatResponse,
          method: 'post',
          url: slackAppWebhook,
        });

        axiosArray.push(axiosPromise);
      }

      await axios.all(axiosArray);
    } catch (err) {
      console.error('SlackOutbound > sendPublicMessage: ', err);
    }
  }

  static async sendPublicMessage(req: any) {
    try {
      const { slackBotToken } = req.organization;
      const { attachments, chatResponse } = req.chasms;
      const config = {
        headers: { Authorization: `Bearer ${slackBotToken}` }
      };
      const axiosArray = [];

      if (attachments.length > 0) {
        chatResponse.attachments = [];

        for (const attachment of attachments) {
          if (attachment) {
            chatResponse.attachments.push(attachment);
          }

          const axiosPromise = await axios({ // eslint-disable-line no-await-in-loop
            data: chatResponse,
            headers: config,
            method: 'post',
            url: SLACK_PUBLIC_MESSAGE_URI,
          });

          axiosArray.push(axiosPromise);
        }
      } else {
        const axiosPromise = await axios({
          data: chatResponse,
          headers: config,
          method: 'post',
          url: SLACK_PUBLIC_MESSAGE_URI,
        });

        axiosArray.push(axiosPromise);
      }

      axios.all(axiosArray);
    } catch (err) {
      console.error('SlackOutbound > sendPublicMessage: ', err);
    }
  }

  static async sendEphemeralMessage(req: any) {
    try {
      const { slackBotToken } = req.organization;
      const { channel_id, user_id } = req.body;
      const { text } = req.chasms.chatResponse;
      const chatUrl = SLACK_EPHEMERAL_MESSAGE_URI;
      const config = {
        headers: { Authorization: `Bearer ${slackBotToken}` }
      };

      axios.post(
        chatUrl,
        {
          as_user: true,
          channel: channel_id,
          link_names: true,
          text,
          user: user_id,
        },
        config,
      )
    } catch (err) {
      console.error('SlackOutbound > sendEphemeralMessage: ', err);
    }
  }
}

export default SlackOutbound;
