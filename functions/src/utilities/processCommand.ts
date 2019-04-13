// import Contact from '../models/Contact';
import * as commandTypes from '../constants/commandTypes';
import extractCompleteSmsNumber from './extractCompleteSmsNumber';

const completeSmsNumberAndText = /^\+1\d{10}\ .+$/;
const commandSmsNumberAndText = /^\+\d{10}\ .+$/;
const leadingUsername = /^\+\S{2,15}\ .+$/;
const add = /^add\ .+$/;
const dir = /^dir\ .*$/;

const processCommand: any = function({ command, organization }) {
  let completeSmsNumber: string = '';
  let type: string = '';
  let message: string = 'Valid command';
  let contact: any = {};

  if (completeSmsNumberAndText.test(command)) {
    // +11234567890
    completeSmsNumber = extractCompleteSmsNumber(command);
    // contact = await Contact.findById({
    //   organizationId: organization.id,
    //   contactId: '17735516808',
    // });
    contact = { firstName: 'Randy', lastName: 'Burgess', completeSmsNumber: '+17735516808', username: 'wrb' };
    type = commandTypes.OUTBOUND_SMS;
  } else if (commandSmsNumberAndText.test(command)) {
    // +1234567890
    completeSmsNumber = '+7735516808';
    type = commandTypes.OUTBOUND_SMS;
    // contact = await Contact.findByVal({ organizationId: organization.id, field: 'smsNumber', val: '17735516808' });
    contact = {
      firstName: 'Randy',
      lastName: 'Burgess',
      completeSmsNumber: '+17735516808',
      username: 'wrb',
    };
  } else if (leadingUsername.test(command)) {
    // +ab
    // contact = await Contact.findByVal({ organizationId: organization.id, field: 'username', val: 'ab' });
    contact = {
      firstName: 'Randy',
      lastName: 'Burgess',
      completeSmsNumber: '+17735516808',
      username: 'wrb',
    };
    completeSmsNumber = contact.smsNumber;
    type = commandTypes.OUTBOUND_SMS;
  } else if (add.test(command)) {
    // add
    type = commandTypes.ADD_CONTACT;
    // contact = await Contact.create({ organizationId: organization.id, completeSmsNumber: '+17735516808' });
    contact = {
      firstName: 'Randy',
      lastName: 'Burgess',
      completeSmsNumber: '+17735516808',
      username: 'wrb',
    };
  } else if (dir.test(command)) {
    // dir
    type = commandTypes.RENDER_DIRECTORY;
  } else {
    // invalid
    type = commandTypes.INVALID;
    message = `Error: Unknown command from ${command}`;
  }

  return { type, completeSmsNumber, message, contact };
};

export default processCommand;
