import * as functions from 'firebase-functions';
import axios from 'axios';

class ChatOutbound {
  serviceUri: string = null;

  constructor() {
    this.serviceUri = functions.config().chasms.slack_app_webhook;
  }

  async sendMessage(req: any) {
    const axiosArray = [];
    const loopCount = req.chasm.attachments.length || 1;

    try {
      for (let i = 0; i < loopCount; i += 1) {
        const chatResponse = req.chasm.chatResponse;
        if (i > 0 && req.chasm.attachments[i]) {
          chatResponse.attachments = req.chasm.attachments[i];
        }

        const axiosPromise = await axios({ // eslint-disable-line no-await-in-loop
          method: 'post',
          url: this.serviceUri,
          data: chatResponse,
        });

        axiosArray.push(axiosPromise);
      }

      const response = axios.all(axiosArray)
    } catch (err) {
      console.log('sendMessage catch error', err);
    }
  }
}

export default ChatOutbound;
