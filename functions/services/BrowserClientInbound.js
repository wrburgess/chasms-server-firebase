import Operator from "../models/Operator";
import Contact from "../models/Contact";
import Message from "../models/Message";
import SlackOutbound from "./SlackOutbound";
import SmsOutbound from "./SmsOutbound";

class BrowserClientInbound {
  static extractDestinationFromCommand(command) {
    const commandSplit = command.split("+")[1];
    let destination = null;

    if (commandSplit) {
      [destination] = commandSplit.split(" ");
    }

    return destination;
  }

  static extractMessageBodyFromCommand(command) {
    const messageBody = command.split(/\s(.+)/)[1];
    return messageBody || null;
  }

  static async sendSmsMessage(req) {
    try {
      let payload = {};
      const { id } = req.organization;
      const { user_name, text } = req.body;
      let recipient = {
        chatUsername: null,
        email: null,
        firstName: null,
        lastName: null,
        smsNumber: null,
        username: null
      };

      const phoneNumberRegex: RegExp = RegExp("^\\d{10}$"); // 9876543210
      const recipientDestination = BrowserClientInbound.extractDestinationFromCommand(
        text
      );

      // Determine if Chat Sender used valid phone number
      if (phoneNumberRegex.test(recipientDestination)) {
        recipient = {
          chatUsername: "",
          email: "",
          firstName: recipientDestination,
          lastName: "",
          smsNumber: recipientDestination,
          username: ""
        };
      } else {
        // Or retrieve SMS Recipient by their username
        recipient = await Contact.findByVal({
          organizationId: id,
          field: "username",
          val: recipientDestination.toLowerCase()
        });
      }

      const smsMessageBody = BrowserClientInbound.extractMessageBodyFromCommand(
        text
      );

      // Determine if SMS Recipient and Message are valid
      if (recipient && smsMessageBody) {
        // Retrieve Chat Sender by chat username
        const sender = await Contact.findByVal({
          organizationId: id,
          field: "chatUsername",
          val: user_name
        });

        payload = {
          organizationId: id,
          status: 200,
          validRequest: true,
          sendSms: true,
          messageType: "browserClientInbound",
          attachments: [],
          chatResponse: {
            response_type: "none",
            text: `${sender.chatUsername}: ${smsMessageBody}`
          },
          smsResponse: {
            smsNumber: recipient.smsNumber,
            body: `${sender.chatUsername}: ${smsMessageBody}`
          }
        };

        req.chasms = payload;
        Message.create(req.chasms);
        SmsOutbound.sendMessage(req);
      } else {
        const attachments = [
          {
            fields: [
              {
                title: `Incorrect contact for command: \`/sms ${text}\`.`,
                value: `Please include a valid \`+username\` for SMS messaging.`,
                short: false
              }
            ],
            color: "#ed4e4e"
          },
          {
            fields: [
              {
                title: `Suggestions`,
                value: [
                  `* Example: \`/sms +username your message\``,
                  `* Type \`/sms dir\` to view a list of contacts`
                ].join("\n"),
                short: false
              }
            ],
            color: "#fa8f00"
          }
        ];

        payload = {
          organizationId: id,
          status: 200,
          validRequest: false,
          sendSms: false,
          messageType: "slackInbound",
          attachments,
          chatResponse: {
            response_type: "ephemeral",
            text: `*ERROR*`
          },
          smsResponse: {
            smsNumber: null,
            body: null
          }
        };
      }

      return payload;
    } catch (err) {
      console.error("SlackInbound > sendSmsMessage:", err);
    }
  }

  static async renderSmsDir(req) {
    const { id } = req.organization;
    const attachments = [];
    const contacts = await Contact.all({ organizationId: id });

    const contactNames = contacts.map(contact => {
      return `${contact.lastName}, ${contact.firstName}`;
    });

    const contactInfo = contacts.map(contact => {
      return `\`+${contact.username}\` or \`+${contact.smsNumber}\``;
    });

    const table = {
      fallback: "Table of Contacts",
      fields: [
        {
          title: "Contact",
          value: contactNames.join("\n"),
          short: true
        },
        {
          title: "Message with /sms",
          value: contactInfo.join("\n"),
          short: true
        }
      ],
      color: "#0269b7"
    };

    attachments.push(table);

    const payload: object = {
      organizationId: id,
      status: 200,
      validRequest: true,
      sendSms: false,
      messageType: "slackInbound",
      attachments,
      chatResponse: {
        response_type: "ephemeral",
        text: "Contact Directory"
      },
      smsResponse: {
        smsNumber: null,
        body: null
      }
    };

    return payload;
  }

  static async addToSmsDir(req) {
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
      messageType: "slackInbound",
      attachments: [],
      chatResponse: {
        response_type: "ephemeral",
        text: "New contact added"
      },
      smsResponse: {
        smsNumber: null,
        body: null
      }
    };

    return payload;
  }

  static renderPrefixError(req, option) {
    const { id } = req.organization;
    const payload: object = {
      organizationId: id,
      status: 200,
      validRequest: true,
      sendSms: false,
      messageType: "slackInbound",
      attachments: [],
      chatResponse: {
        response_type: "ephemeral",
        text: `Error! \`${option}\` is not a valid prefix.`
      },
      smsResponse: {
        smsNumber: null,
        body: null
      }
    };

    return payload;
  }

  static async processMessage(req) {
    const option = req.body.text.split(" ")[0];

    if (option[0] === "+") {
      req.chasms = await BrowserClientInbound.sendSmsMessage(req);
    } else if (option === "dir") {
      req.chasms = await BrowserClientInbound.renderSmsDir(req);
    } else if (option === "add") {
      req.chasms = await BrowserClientInbound.addToSmsDir(req);
    } else {
      req.chasms = await BrowserClientInbound.renderPrefixError(req, option);
    }

    if (req.chasms.chatResponse.response_type === "ephemeral") {
      SlackOutbound.sendEphemeralMessage(req);
    } else if (req.chasms.chatResponse.response_type === "in_channel") {
      SlackOutbound.sendPublicMessage(req);
    }
  }
}

export default BrowserClientInbound;
