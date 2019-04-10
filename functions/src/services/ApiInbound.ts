// import Contact from '../models/Contact';
// import Operator from '../models/Operator';
import Message from '../models/Message';

class ApiInbound {
  static async processMessage(req: any) {
    // const smsResponse = constructSmsResponse(req);
    // Does the organization use Slack?
    // Do the leading characters include an SMS valid recipient?

    const payload = {
      organizationId: req,
      channelId: req,
      smsInboundNumber: null,
      type: 'apiInbound',
      author: {},
      body: '',
      slackResponse: {
        status: false,
        responseType: '',
      },
      smsResponse: {
        status: false,
      },
      apiResponse: {
        status: true,
      },
      tags: [],
      attachments: [],
      archived: false,
    };

    Message.create(payload);

    return payload;
  }
}

export default ApiInbound;
