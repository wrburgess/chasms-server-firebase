const functions = require('firebase-functions');

const User = require('../models/User');

class ChatInbound {
  constructor() {
    this.service_uri = functions.config().chasms.slack_app_webhook;
  }

  static authorized(req) {
    return (
      (req.body.team_id === functions.config().chasms.slack_team_id) &&
      (req.body.channel_id === functions.config().chasms.slack_channel_id)
    )
  }

  static extractDestinationFromCommand(command) {
    const commandSplit = command.split('+')[1];
    let Destination = null;

    if (commandSplit) {
      [Destination] = commandSplit.split(' ');
    }

    return Destination;
  }

  static extractMessageBodyFromCommand(command) {
    const messageBody = command.split(/\s(.+)/)[1];

    return messageBody || null;
  }

  static sendSmsMessage(req) {
    let payload = {};
    let recipient = {};
    const user = new User();
    const phoneNumberRegex = RegExp('^\\d{10}$'); // 9876543210
    const recipientDestination = ChatInbound.extractDestinationFromCommand(req.body.text);

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
      const recipient = user.findByDirectoryUsername(recipientDestination.toLowerCase())
        .then(userVal => {
          recipient = userVal;
          return recipient;
        })
        .catch(err => {
          console.error('ChatInbound.js > sendSmsMessage: ', err);
        });
    }

    const smsMessageBody = ChatInbound.extractMessageBodyFromCommand(req.body.text);

    // Determine if SMS Recipient and Message are valid
    if (recipient && smsMessageBody) {
      // Retrieve Chat Sender by chat username
      const sender = user.findByChatUsername(req.body.user_name)
        .then(snapshot => {
          let sender = {};
          const values = snapshot.val();

          if (values) {
            return User.accessUser(values);
          } else {
            sender.chatUsername = req.body.user_name;
            return sender;
          }
        })
        .catch(err => {
          console.error('ChatInbound.js > sendSmsMessage: ', err);
        })
      console.log('\x1b[37m', '\x1b[31m', '\n\n====\n', 'sender: ', sender, '\n====\n', '\x1b[0m');
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

      return payload;
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

  static showSmsDir() {
    let displayMessage = '';

    const users = User.all();

    try {
      const compareObjects = (a, b) => {
        if (a.firstName < b.firstName) {
          return -1;
        }
        if (a.firstName > b.firstName) {
          return 1;
        }

        return 0;
      };

      const sorted = Object.values(users).sort(compareObjects);

      sorted.forEach((listItem) => {
        displayMessage += `${listItem.firstName} ${listItem.lastName}` +
          ` (${listItem.smsNumber}) can be texted using ` +
          `+${listItem.username}\n`;
      });

      const payload = {
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
    } catch(err) {
      console.error('ChatInbound.js > showSmsDir: ', err);
    };
  }

  static addToSmsDir(req) {
    const user = new User();
    // get/validate command to add user
    // send help message back if invalid
    // send confirmation back with buttons if valid
    // add user to directory after checking for dupe phone number

    const payload = {
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

  static showCommandError(option) {
    const payload = {
      status: 200,
      validRequest: true,
      sendSms: false,
      chatResponse: {
        response_type: 'ephemeral',
        text: `Error! \`${option}\` is not a valid command.`,
      },
      smsResponse: {
        smsNumber: null,
        body: null,
      },
    };

    return payload;
  }

  static processMessage(req) {
    let payload = {};
    const option = req.body.text.split(' ')[0];

    if (option[0] === '+') {
      payload = ChatInbound.sendSmsMessage(req);
    } else if (option === 'dir') {
      payload = ChatInbound.showSmsDir();
    } else if (option === 'add') {
      payload = ChatInbound.addToSmsDir(req);
    } else {
      payload = ChatInbound.showCommandError(option);
    }

    return payload;
  }
}

module.exports = ChatInbound;
