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
      const loopCount = attachments.length || 1;

      for (let i = 0; i < loopCount; i += 1) {
        if (i > 0 && attachments[i]) {
          chatResponse.attachments = attachments[i];
        }

        const axiosPromise = await axios({ // eslint-disable-line no-await-in-loop
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
