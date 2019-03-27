import axios from "axios";

import {
  SLACK_EPHEMERAL_MESSAGE_URI,
  SLACK_PUBLIC_MESSAGE_URI
} from "../constants/config";

class SlackOutbound {
  static async sendDelayedReply(req, responseType = "in_channel") {
    try {
      const { slackBotToken } = req.organization;
      const { chatResponse } = req.chasms;
      const config = {
        headers: { Authorization: `Bearer ${slackBotToken}` }
      };

      axios.post(
        req.body.response_url,
        {
          response_type: responseType,
          text: chatResponse.text
        },
        config
      );
    } catch (err) {
      console.error("SlackOutbound > sendDelayedReply: ", err);
    }
  }

  static async sendPublicMessage(req) {
    try {
      const { slackBotToken, slackChannelId } = req.organization;
      const { attachments, chatResponse } = req.chasms;
      const config = {
        headers: { Authorization: `Bearer ${slackBotToken}` }
      };

      axios.post(
        SLACK_PUBLIC_MESSAGE_URI,
        {
          as_user: false,
          channel: slackChannelId,
          link_names: true,
          text: chatResponse.text,
          attachments
        },
        config
      );
    } catch (err) {
      console.error("SlackOutbound > sendPublicMessage: ", err);
    }
  }

  static async sendEphemeralMessage(req) {
    try {
      const { slackBotToken } = req.organization;
      const { channel_id, user_id } = req.body;
      const { text } = req.chasms.chatResponse;
      const config = {
        headers: { Authorization: `Bearer ${slackBotToken}` }
      };
      const payload = {
        attachments: req.chasms.attachments,
        as_user: true,
        channel: channel_id,
        link_names: true,
        text,
        user: user_id
      };

      axios.post(SLACK_EPHEMERAL_MESSAGE_URI, payload, config);
    } catch (err) {
      console.error("SlackOutbound > sendEphemeralMessage: ", err);
    }
  }
}

export default SlackOutbound;
