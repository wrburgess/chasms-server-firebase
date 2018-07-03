import * as functions from 'firebase-functions';
import axios from 'axios';

class ChatOutbound {
  serviceUri: string = null;

  constructor(req) {
    const { slackAppWebhook } = req.chasms.organization;

    this.serviceUri = slackAppWebhook;
  }

  async sendMessage(req: any) {
    const axiosArray = [];
    const loopCount = req.chasm.attachments.length || 1;

    try {
      for (let i = 0; i < loopCount; i += 1) {
        const { chatResponse } = req.chasm;

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

      axios.all(axiosArray)
        .then()
        .catch(err => {
          console.error('ChatOutbound > sendMessage > axios > error: ', err);
        });
    } catch (err) {
      console.error('ChatOutbound > sendMessage > error: ', err);
    }
  }
}

export default ChatOutbound;
