import AutoId from '../utilities/AutoId';
import Contact from '../models/Contact';
import Message from '../models/Message';
import * as sourceTypes from '../constants/sourceTypes';
import * as authorTypes from '../constants/authorTypes';
import * as slackResponseTypes from '../constants/slackResponseTypes';
import * as messageTypes from '../constants/messageTypes';

class SmsInbound {
  static async processRequest({ req, organization }) {
    const { AccountSid, SmsSid, ApiVersion, Body, To, From, NumMedia } = req.body;
    let messageBody: string = '';

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
      messageBody = `+${contact.username} (sms): ${Body}`;
    } else {
      messageBody = `${From} (sms): ${Body}`;
    }

    let slackResponse = {};
    if (organization.usesSlack) {
      slackResponse = {
        status: true,
        response_type: slackResponseTypes.IN_CHANNEL,
        body: messageBody,
      };
    } else {
      slackResponse = {
        status: false,
        response_type: '',
        body: '',
      };
    }

    const message = {
      id: AutoId.newId(),
      status: 200,
      type: messageTypes.SMS_INBOUND,
      requestBody: Body,
      validRequest: true,
      archived: false,
      attachments,
      tags: [],
      smsInboundNumber: To,
      source: {
        type: sourceTypes.TWILIO,
        meta: {
          AccountSid,
          SmsSid,
          ApiVersion,
        },
      },
      author: {
        type: authorTypes.CONTACT,
        id: contact.id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        username: contact.username,
        smsNumber: contact.smsNumber,
        email: contact.email,
      },
      organization: {
        id: organization.id,
        name: organization.name,
      },
      channelResponse: {
        status: true,
        id: channel.id,
        name: channel.name,
        body: messageBody,
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
        smsNumber: '',
        body: '',
      },
    };

    Message.create(message);

    return message;
  }
}

export default SmsInbound;
