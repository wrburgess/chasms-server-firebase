import * as faker from 'faker';
import processCommand from '../../src/utilities/processCommand';
import * as commandTypes from '../../src/constants/commandTypes';

describe('utilities/processCommand', () => {
  it('should process the command given a Complete SMS Number', () => {
    const completeSmsNumber = faker.phone.phoneNumber('+1##########');
    const organization = {};
    const command = `${completeSmsNumber} {faker.lorem.sentence}`;
    const contact = { firstName: 'Randy', lastName: 'Burgess', completeSmsNumber, username: 'wrb' };
    const result = {
      completeSmsNumber,
      type: commandTypes.OUTBOUND_SMS,
      message: 'Valid command',
      contact,
    };

    expect(processCommand({ command, organization })).toEqual(result);
  });

  it('should process the command given a Command SMS Number', () => {
    const commandSmsNumber = faker.phone.phoneNumber('+##########');
    const completeSmsNumber = `+1${commandSmsNumber.substring(1)}`;
    const organization = {};
    const command = `${completeSmsNumber} {faker.lorem.sentence}`;
    const contact = {
      firstName: 'Randy',
      lastName: 'Burgess',
      completeSmsNumber,
      username: 'wrb',
    };
    const result = {
      completeSmsNumber,
      type: commandTypes.OUTBOUND_SMS,
      message: 'Valid command',
      contact,
    };

    expect(processCommand({ command, organization })).toEqual(result);
  });
});
