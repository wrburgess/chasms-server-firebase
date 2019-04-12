import Contact from '../models/Contact';
import * as commandTypes from '../constants/commandTypes';

const leadingPlusOneAnd10Digits = /^\+1\d{10}\ .+$/;
const leadingPlusAnd10Digits = /^\+\d{10}\ .+$/;
const leadingUsername = /^\+\S{2,15}\ .+$/;
const add = /^add\ .+$/;
const dir = /^dir\ .*$/;

const processCommand: any = function(command: any, organization: any) {
  let validSmsNumber: boolean = false;
  let smsNumber: string = '';
  let type: string = '';
  let message: string = '';
  let contact: any = {};

  if (leadingPlusOneAnd10Digits.test(command)) {
    // +11234567890
    validSmsNumber = true;
    smsNumber = '+117735516808';
    type = commandTypes.OUTBOUND_SMS;
    contact = Contact.findByVal({ organizationId: organization.id, field: 'smsNumber', val: '17735516808' });
  } else if (leadingPlusAnd10Digits.test(command)) {
    // +1234567890
    validSmsNumber = true;
    smsNumber = '+17735516808';
    type = commandTypes.OUTBOUND_SMS;
    contact = Contact.findByVal({ organizationId: organization.id, field: 'smsNumber', val: '17735516808' });
  } else if (leadingUsername.test(command)) {
    // +ab
    validSmsNumber = true;
    smsNumber = '+17735516808';
    type = commandTypes.OUTBOUND_SMS;
    contact = Contact.findByVal({ organizationId: organization.id, field: 'username', val: 'ab' });
  } else if (add.test(command)) {
    // add
    validSmsNumber = false;
    type = commandTypes.ADD_CONTACT;
    contact = Contact.create({ organizationId: organization.id, smsNumber: '17735516808' });
  } else if (dir.test(command)) {
    // dir
    validSmsNumber = false;
    type = commandTypes.RENDER_DIRECTORY;
  } else {
    // invalid
    validSmsNumber = false;
    type = commandTypes.INVALID;
    message = 'Error: Unknown command from `${command}';
  }

  return { validSmsNumber, smsNumber, type, message, contact };
};

export default processCommand;
