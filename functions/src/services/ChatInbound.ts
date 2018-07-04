import Contact from '../models/Contact';
import Message from '../models/Message';

class ChatInbound {
  static extractDestinationFromCommand(command: string) {
    const commandSplit = command.split('+')[1];
    let destination = null;

    if (commandSplit) {
      [destination] = commandSplit.split(' ');
    }

    return destination;
  }

  static extractMessageBodyFromCommand(command) {
    const messageBody = command.split(/\s(.+)/)[1];

    return messageBody || null;
  }

  static async sendSmsMessage(req: any) {
    const { id } = req.organization;
    const { user_name, text } = req.body;
    let payload: object = {};
    let recipient: any = {
      chatUsername: null,
      email: null,
      firstName: null,
      lastName: null,
      smsNumber: null,
      username: null,
    };

    const phoneNumberRegex: RegExp = RegExp('^\\d{10}$'); // 9876543210
    const recipientDestination: string = ChatInbound.extractDestinationFromCommand(text);

    // Determine if Chat Sender used valid phone number
    if (phoneNumberRegex.test(recipientDestination)) {
      recipient = {
        chatUsername: '',
        email: '',
        firstName: recipientDestination,
        lastName: '',
        smsNumber: recipientDestination,
        username: '',
      };
    } else {
      // Or retrieve SMS Recipient by their username
      recipient = await Contact.findByVal({
        organizationId: id,
        field: 'username',
        val: recipientDestination.toLowerCase()
      });
    }

    const smsMessageBody: string = ChatInbound.extractMessageBodyFromCommand(text);

    // Determine if SMS Recipiet and Message are valid
    if (recipient && smsMessageBody) {
      // Retrieve Chat Sender by chat username
      const sender: any = await Contact.findByVal({
        organizationId: id,
        field: 'chatUsername',
        val: user_name,
      });

      payload = {
        organizationId: id,
        status: 200,
        validRequest: true,
        sendSms: true,
        messageType: 'chatInbound',
        attachments: [{}],
        chatResponse: {
          response_type: 'in_channel',
          text: '',
        },
        smsResponse: {
          smsNumber: recipient.smsNumber,
          body: `${sender.chatUsername}: ${smsMessageBody}`,
        },
      };

      Message.create(payload);
    } else {
      payload = {
        organizationId: id,
        status: 200,
        validRequest: false,
        sendSms: false,
        messageType: 'chatInbound',
        attachments: [{}],
        chatResponse: {
          response_type: 'ephemeral',
          text: `Error! Incorrect message for: \`${text}\`.\nPlease include +username and text for SMS messaging.\nExample: \`/sms +username your message\``,
        },
        smsResponse: {
          smsNumber: null,
          body: null,
        },
      };
    }

    return payload;
  }

  static async renderSmsDir(req: any) {
    const { id } = req.organization;
    let displayMessage: string = '';
    const contacts: any = await Contact.all({ organizationId: id });

    contacts.forEach((listItem) => {
      displayMessage += `${listItem.firstName} ${listItem.lastName} \
        (${listItem.smsNumber}) can be texted using \
        +${listItem.username}\n`;
    });

    const payload: object = {
      organizationId: id,
      status: 200,
      validRequest: true,
      sendSms: false,
      messageType: 'chatInbound',
      attachments: [{}],
      chatResponse: {
        response_type: 'ephemeral',
        text: displayMessage,
      },
      smsResponse: {
        smsNumber: null,
        body: null,
      },
    };

    return payload;
  }

  static async addToSmsDir(req: any) {
    // const user: User = new User();
    // get/validate command to add user
    // send help message back if invalid
    // send confirmation back with buttons if valid
    // add user to directory after checking for dupe phone number
    const { id } = req.organization;
    const payload: object = {
      organizationId: id,
      status: 200,
      validRequest: true,
      sendSms: false,
      messageType: 'chatInbound',
      chatResponse: {
        response_type: 'ephemeral',
        text: null, // displayMessage
      },
      smsResponse: {
        smsNumber: null,
        body: null,
      },
    };

    return payload;
  }

  static renderPrefixError(req: any, option: string) {
    const { id } = req.organization;
    const payload: object = {
      organizationId: id,
      status: 200,
      validRequest: true,
      sendSms: false,
      messageType: 'chatInbound',
      chatResponse: {
        response_type: 'ephemeral',
        text: `Error! \`${option}\` is not a valid prefix.`,
      },
      smsResponse: {
        smsNumber: null,
        body: null,
      },
    };

    return payload;
  }

  static async processMessage(req: any) {
    let payload: object = {};
    const option: string = req.body.text.split(' ')[0];

    if (option[0] === '+') {
      payload = ChatInbound.sendSmsMessage(req);
    } else if (option === 'dir') {
      payload = ChatInbound.renderSmsDir(req);
    } else if (option === 'add') {
      payload = ChatInbound.addToSmsDir(req);
    } else {
      payload = ChatInbound.renderPrefixError(req, option);
    }

    return payload;
  }
}

export default ChatInbound;
