import * as functions from 'firebase-functions';
import User from '../models/User';

class ChatInbound {
  serviceUri: string;

  constructor() {
    this.serviceUri = functions.config().chasms.slack_app_webhook;
  }

  static authorized(req: any) {
    return (
      (req.body.team_id === functions.config().chasms.slack_team_id) &&
      (req.body.channel_id === functions.config().chasms.slack_channel_id)
    )
  }

  static extractDestinationFromCommand(command: string) {
    const commandSplit = command.split('+')[1];
    let destination = null;

    if (commandSplit) {
      [destination] = commandSplit.split(' ');
    }

    return destination;
  }

  // TODO: use regex
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
      recipient = await user.findByDirectoryUsername(recipientDestination.toLowerCase());
    }

    const smsMessageBody: string = ChatInbound.extractMessageBodyFromCommand(req.body.text);

    // Determine if SMS Recipiet and Message are valid
    if (recipient && smsMessageBody) {
      // Retrieve Chat Sender by chat username
      const sender: any = await user.findByChatUsername(req.body.user_name);

      payload = {
        status: 200,
        validRequest: true,
        sendSms: true,
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
        status: 200,
        validRequest: false,
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

  static async renderSmsDir() {
    let displayMessage: string = '';
    const users: any = await User.all();

    const compareObjects = (a: any, b: any): number => {
      if (a.firstName < b.firstName) {
        return -1;
      }
      if (a.firstName > b.firstName) {
        return 1;
      }

      return 0;
    };

    const usersSorted: any = Object.values(users).sort(compareObjects);

    usersSorted.forEach((listItem) => {
      displayMessage += `${listItem.firstName} ${listItem.lastName} \
        (${listItem.smsNumber}) can be texted using \
        +${listItem.username}\n`;
    });

    const payload: object = {
      status: 200,
      validRequest: true,
      sendSms: false,
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
      status: 200,
      validRequest: true,
      sendSms: false,
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

  static renderPrefixError(option: string) {
    const payload = {
      status: 200,
      validRequest: true,
      sendSms: false,
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
      payload = ChatInbound.renderSmsDir();
    } else if (option === 'add') {
      payload = ChatInbound.addToSmsDir(req);
    } else {
      payload = ChatInbound.renderPrefixError(option);
    }

    return payload;
  }
}

export default ChatInbound;
