import AutoId from '../utilities/AutoId';
import Contact from '../models/Contact';
import Message from '../models/Message';
import * as sourceTypes from '../constants/sourceTypes';
import * as authorTypes from '../constants/authorTypes';
import * as slackResponseTypes from '../constants/slackResponseTypes';
import * as messageTypes from '../constants/messageTypes';

class SmsInbound {
  static async processRequest({ req, organization }) {
    const { Body, To, From, NumMedia } = req;
    let formattedMessageBody: string = '';

    const channel: any = organization.channels[To];
    const contact: any = await Contact.findByValOrCreate({
      organizationId: organization.id,
      field: 'smsPhoneNumber',
      val: From,
    });

    const attachmentsCount: number = Number(NumMedia);
    const attachments: Array<any> = [];

    if (attachmentsCount > 0) {
      for (let i = 0; i < attachmentsCount; i += 1) {
        attachments.push({
          fallback: 'Error: Message can not render',
          image_url: req.body[`MediaUrl${i}`],
          color: '#3AA3E3',
        });
      }
    }

    if (contact.username) {
      formattedMessageBody = `+${contact.username} (sms): ${Body}`;
    } else {
      formattedMessageBody = `${From} (sms): ${Body}`;
    }

    let slackResponse = {};
    if (organization.usesSlack) {
      slackResponse = {
        body: formattedMessageBody,
        channel_id: organization.slackChannelId,
        response_type: slackResponseTypes.IN_CHANNEL,
        status: true,
        token: organization.slackBotToken,
      };
    } else {
      slackResponse = {
        body: '',
        channel_id: '',
        response_type: '',
        status: false,
        token: '',
      };
    }

    const message = {
      id: AutoId.newId(),
      status: 200,
      type: messageTypes.TWILIO_INBOUND,
      requestBody: Body,
      validRequest: true,
      archived: false,
      attachments,
      tags: [],
      smsInboundNumber: To,
      source: {
        type: sourceTypes.TWILIO,
        meta: {
          ...req,
        },
      },
      author: {
        type: authorTypes.CONTACT,
        id: contact.id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        username: contact.username,
        completeSmsNumber: contact.completeSmsNumber,
      },
      organization: {
        id: organization.id,
        name: organization.name,
      },
      channelResponse: {
        status: true,
        id: channel.id,
        name: channel.name,
        body: formattedMessageBody,
      },
      apiResponse: {
        status: false,
        body: '',
      },
      slackResponse: {
        ...slackResponse,
      },
      smsResponse: {
        status: false,
        completeSmsNumber: '',
        body: '',
        contact: {},
      },
    };

    // console.log('message', message);

    Message.create(message);

    return message;
  }
}

export default SmsInbound;
