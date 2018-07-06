import axios from 'axios';

class ChatOutbound {
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
        console.log({ chatResponse });

        const axiosPromise = await axios({
          method: 'post',
          url: this.serviceUri,
          data: chatResponse,
        });

        axiosArray.push(axiosPromise);
      }

      await axios.all(axiosArray);
    } catch (err) {
      console.error('ChatOutbound > sendMessage: ', err);
    }
  }
}

export default ChatOutbound;
