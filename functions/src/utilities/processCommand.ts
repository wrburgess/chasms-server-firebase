import Contact from '../models/Contact';
import * as commandTypes from '../constants/commandTypes';
import extractCompleteSmsNumber from './extractCompleteSmsNumber';

const completeSmsNumberAndText = /^\+1\d{10}\ .+$/; // +11234567890
const commandSmsNumberAndText = /^\+\d{10}\ .+$/; // +1234567890
const leadingUsername = /^\+\S{2,15}\ .+$/; // +ab
const add = /^add\ .+$/;
const dir = /^dir\ .*$/;

const processCommand: any = async function({ command, organization }) {
  let completeSmsNumber: string = '';
  let type: string = '';
  let message: string = 'Valid command';
  let contact: any = {};

  if (completeSmsNumberAndText.test(command)) {
    completeSmsNumber = extractCompleteSmsNumber(command);
    type = commandTypes.OUTBOUND_SMS;
    contact = await Contact.findById({ organizationId: organization.id, contactId: completeSmsNumber });
  } else if (commandSmsNumberAndText.test(command)) {
    completeSmsNumber = extractCompleteSmsNumber(command);
    type = commandTypes.OUTBOUND_SMS;
    contact = await Contact.findById({ organizationId: organization.id, contactId: completeSmsNumber });
  } else if (leadingUsername.test(command)) {
    const username: string = command.split(' ')[0].substring(1);
    contact = await Contact.findByVal({ organizationId: organization.id, field: 'username', val: username });

    if (contact) {
      type = commandTypes.OUTBOUND_SMS;
      completeSmsNumber = contact.completeSmsNumber;
    } else {
      type = commandTypes.INVALID;
      message = 'Unknown username';
      contact = {};
    }
  } else if (add.test(command)) {
    type = commandTypes.ADD_CONTACT;
  } else if (dir.test(command)) {
    type = commandTypes.RENDER_DIRECTORY;
  } else {
    type = commandTypes.INVALID;
    message = `Error: Unknown command of "${command}"`;
  }

  return { type, completeSmsNumber, message, contact };
};

export default processCommand;
