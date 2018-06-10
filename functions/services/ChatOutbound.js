const keys = require('config').get('keys');
const axios = require('axios');

class ChatOutbound {
  constructor() {
    this.serviceUri = keys.SLACK_APP_WEBHOOK;
  }

  sendMessage(req) {
    const axiosArray = [];
    const loopCount = req.chasm.attachments.length || 1;

    for (let i = 0; i < loopCount; i += 1) {
      const chatResponse = req.chasm.chatResponse;
      if (i > 0 && req.chasm.attachments[i]) {
        chatResponse.attachments = req.chasm.attachments[i];
      }
      const newPromise = axios({ // eslint-disable-line no-await-in-loop
        method: 'post',
        url: this.serviceUri,
        data: chatResponse,
      });
      axiosArray.push(newPromise);
    }

    axios
      .all(axiosArray)
      .then()
      .catch((err) => {
        console.log('sendMessage catch error', err);
      });
  }
}

module.exports = ChatOutbound;
