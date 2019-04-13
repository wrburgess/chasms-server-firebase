import Contact from '../models/Contact';
import * as commandTypes from '../constants/commandTypes';
import extractCompleteSmsNumber from './extractCompleteSmsNumber';

const leadingPlusOneAnd10Digits = /^\+1\d{10}\ .+$/;
const leadingPlusAnd10Digits = /^\+\d{10}\ .+$/;
const leadingUsername = /^\+\S{2,15}\ .+$/;
const add = /^add\ .+$/;
const dir = /^dir\ .*$/;

const processCommand: any = async function({ command, organization }) {
  let validSmsNumber: boolean = false;
  let completeSmsNumber: string = '';
  let type: string = '';
  let message: string = '';
  let contact: any = {};

  console.log('Contact > processCommand > command:', command);
  if (leadingPlusOneAnd10Digits.test(command)) {
    // +11234567890
    completeSmsNumber = extractCompleteSmsNumber(command);
    contact = await Contact.findById({
      organizationId: organization.id,
      contactId: '17735516808',
    });
    validSmsNumber = true;
    completeSmsNumber = `+${contact.smsNumber}`;
    type = commandTypes.OUTBOUND_SMS;
  } else if (leadingPlusAnd10Digits.test(command)) {
    // +1234567890
    validSmsNumber = true;
    completeSmsNumber = '+7735516808';
    type = commandTypes.OUTBOUND_SMS;
    contact = await Contact.findByVal({ organizationId: organization.id, field: 'smsNumber', val: '17735516808' });
  } else if (leadingUsername.test(command)) {
    // +ab
    contact = await Contact.findByVal({ organizationId: organization.id, field: 'username', val: 'ab' });
    validSmsNumber = true;
    completeSmsNumber = contact.smsNumber;
    type = commandTypes.OUTBOUND_SMS;
  } else if (add.test(command)) {
    // add
    validSmsNumber = false;
    type = commandTypes.ADD_CONTACT;
    contact = await Contact.create({ organizationId: organization.id, completeSmsNumber: '+17735516808' });
  } else if (dir.test(command)) {
    // dir
    validSmsNumber = false;
    type = commandTypes.RENDER_DIRECTORY;
  } else {
    // invalid
    validSmsNumber = false;
    type = commandTypes.INVALID;
    message = `Error: Unknown command from ${command}`;
  }

  return { validSmsNumber, completeSmsNumber, type, message, contact };
};

export default processCommand;
