import User from '../models/User';

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
    let payload: object = {};
    let recipient: any = {
      chatUsername: null,
      email: null,
      firstName: null,
      lastName: null,
      smsNumber: null,
      username: null,
    };
    const user: User = new User();
    const phoneNumberRegex: RegExp = RegExp('^\\d{10}$'); // 9876543210
    const recipientDestination: string = ChatInbound.extractDestinationFromCommand(req.body.text);

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
      recipient = await User.findByVal({
        organizationId: req.chasms.organization.id,
        field: 'username',
        val: recipientDestination.toLowerCase()
      });
    }

    const smsMessageBody: string = ChatInbound.extractMessageBodyFromCommand(req.body.text);

    // Determine if SMS Recipiet and Message are valid
    if (recipient && smsMessageBody) {
      // Retrieve Chat Sender by chat username
      const sender: any = await User.findByVal({
        organizationId: req.chasms.organization.id,
        field: 'chatUsername',
        val: req.body.user_name,
      });

      payload = {
        organizationId: req.chasms.organization.id,
        status: 200,
        validRequest: true,
        sendSms: true,
        messageType: 'chatInbound',
        chatResponse: {
          response_type: 'in_channel',
          text: '',
        },
        smsResponse: {
          smsNumber: recipient.smsNumber,
          body: `${sender.chatUsername}: ${smsMessageBody}`,
        },
      };
    } else {
      payload = {
        organizationId: req.chasms.organization.id,
        status: 200,
        validRequest: false,
        sendSms: false,
        messageType: 'chatInbound',
        chatResponse: {
          response_type: 'ephemeral',
          text: `Error! Incorrect message for: \`${req.body.text}\`.\nPlease include +username and text for SMS messaging.\nExample: \`/sms +username your message\``,
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
    let displayMessage: string = '';
    const users: any = await User.all({ organizationId: req.chasms.organization.id });

    console.log('renderSmsDir: ', { users });

    users.forEach((listItem) => {
      displayMessage += `${listItem.firstName} ${listItem.lastName} \
        (${listItem.smsNumber}) can be texted using \
        +${listItem.username}\n`;
    });

    const payload: object = {
      organizationId: req.chasms.organization.id,
      status: 200,
      validRequest: true,
      sendSms: false,
      messageType: 'chatInbound',
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

    const payload: object = {
      organizationId: req.chasms.organization.id,
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
    const payload: object = {
      organizationId: req.chasms.organization.id,
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
