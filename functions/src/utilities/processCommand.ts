import Contact from '../models/Contact';
import * as commandTypes from '../constants/commandTypes';
import extractCompleteSmsNumber from './extractCompleteSmsNumber';
import extractMessageFromCommand from './extractMessageFromCommand';

const completeSmsNumberAndText = /^\+1\d{10}\ .+$/; // +11234567890
const commandSmsNumberAndText = /^\+\d{10}\ .+$/; // +1234567890
const leadingUsername = /^\+\S{2,15}\ .+$/; // +ab
const add = /^add\ .+$/;
const dir = /^dir\ .*$/;

const processCommand: any = async function({ command, organization }) {
  let completeSmsNumber: string = '';
  let messageBody: string = '';
  let type: string = '';
  let errorMessage: string = 'Valid command';
  let contact: any = {};

  if (completeSmsNumberAndText.test(command)) {
    completeSmsNumber = extractCompleteSmsNumber(command);
    messageBody = extractMessageFromCommand(command);
    type = commandTypes.OUTBOUND_SMS;
    contact = await Contact.findByValOrCreate({
      organizationId: organization.id,
      field: 'completeSmsNumber',
      val: completeSmsNumber,
    });
  } else if (commandSmsNumberAndText.test(command)) {
    completeSmsNumber = extractCompleteSmsNumber(command);
    messageBody = extractMessageFromCommand(command);
    type = commandTypes.OUTBOUND_SMS;
    contact = await Contact.findByValOrCreate({
      organizationId: organization.id,
      field: 'completeSmsNumber',
      val: completeSmsNumber,
    });
  } else if (leadingUsername.test(command)) {
    const username: string = command.split(' ')[0].substring(1);
    messageBody = extractMessageFromCommand(command);
    contact = await Contact.findByVal({ organizationId: organization.id, field: 'username', val: username });

    if (contact) {
      type = commandTypes.OUTBOUND_SMS;
      completeSmsNumber = contact.completeSmsNumber;
    } else {
      type = commandTypes.INVALID;
      errorMessage = 'Unknown username';
      contact = {};
    }
  } else if (add.test(command)) {
    messageBody = extractMessageFromCommand(command);
    type = commandTypes.ADD_CONTACT;
  } else if (dir.test(command)) {
    messageBody = extractMessageFromCommand(command);
    type = commandTypes.RENDER_DIRECTORY;
  } else {
    messageBody = extractMessageFromCommand(command);
    type = commandTypes.INVALID;
    errorMessage = `Error: Unknown command of "${command}"`;
  }

  return { completeSmsNumber, messageBody, type, errorMessage, contact };
};

export default processCommand;
