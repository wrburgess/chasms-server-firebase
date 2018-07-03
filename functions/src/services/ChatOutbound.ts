import * as functions from 'firebase-functions';
import axios from 'axios';

class ChatOutbound {
  serviceUri: string = null;

  constructor(req) {
    const { slackAppWebhook } = req.organization;
    this.serviceUri = slackAppWebhook;
  }

  async sendMessage(req: any) {
    const axiosArray = [];
    const loopCount = req.chasms.attachments.length || 1;

    try {
      for (let i = 0; i < loopCount; i += 1) {
        const { chatResponse } = req.chasms;

        if (i > 0 && req.chasms.attachments[i]) {
          chatResponse.attachments = req.chasms.attachments[i];
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
