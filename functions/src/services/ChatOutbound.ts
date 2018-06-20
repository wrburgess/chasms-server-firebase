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
        const { chatResponse } = req.chasm;

        if (i > 0 && req.chasm.attachments[i]) {

          console.log('ChatOutbound > sendMessage > req.chasm.attachments[i]: ', req.chasm.attachments[i]);

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
      console.log('ChatOutbound > sendMessage > error: ', err);
    }
  }
}

export default ChatOutbound;
