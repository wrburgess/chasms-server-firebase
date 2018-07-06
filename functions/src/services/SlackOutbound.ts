import axios from 'axios';

class SlackOutbound {
  serviceUri: string = null;

  constructor(req) {
    this.serviceUri = req.organization.slackAppWebhook;
  }

  async sendMessage(req: any) {
    try {
      const { attachments, chatResponse } = req.chasms;
      const axiosArray = [];

      if (attachments.length > 0) {
        chatResponse.attachments = [];

        for (const attachment of attachments) {
          if (attachment) {
            chatResponse.attachments.push(attachment);
          }

          const axiosPromise = await axios({ // eslint-disable-line no-await-in-loop
            method: 'post',
            url: this.serviceUri,
            data: chatResponse,
          });

          axiosArray.push(axiosPromise);
        }
      } else {
        const axiosPromise = await axios({
          method: 'post',
          url: this.serviceUri,
          data: chatResponse,
        });

        axiosArray.push(axiosPromise);
      }

      await axios.all(axiosArray);
    } catch (err) {
      console.error('SlackOutbound > sendMessage: ', err);
    }
  }

  async sendEphemeralMessage(req: any) {
    const chatUrl = 'https://slack.com/api/chat.postEphemeral';

    try {
      const token = 'xoxb-331363660965-lsoZmSWg0QzTolGca34bGTJl';
      const config = {
        headers: { 'Authorization': 'Bearer ' + token }
      };

      const axiosResponse = await axios.post(
        chatUrl,
        {
          channel: req.body.channel_id,
          text: req.chasms.chatResponse.text,
          user: req.body.user_id,
          as_user: true,
          link_names: true,
        },
        config,
      );
    } catch (err) {
      console.error('SlackOutbound > sendEphemeralMessage: ', err);
    }
  }
}

export default SlackOutbound;
