import * as faker from 'faker';
import processCommand from '../../src/utilities/processCommand';
import * as commandTypes from '../../src/constants/commandTypes';
import Contact from '../../src/models/Contact';

describe('utilities/processCommand', () => {
  it('should process the command given a Complete SMS Number', () => {
    const completeSmsNumber: string = faker.phone.phoneNumber('+1##########');
    const organization: any = { id: faker.random.uuid() };
    const messageBody: string = faker.lorem.sentence();
    const command: string = `${completeSmsNumber} ${messageBody}`;
    const contact: any = {
      id: faker.random.uuid(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      username: faker.internet.userName(),
      completeSmsNumber,
    };

    const result: any = {
      completeSmsNumber,
      messageBody,
      type: commandTypes.OUTBOUND_SMS,
      errorMessage: 'Valid command',
      contact,
    };

    const asyncContactMock: any = jest.spyOn(Contact, 'findByValOrCreate');
    asyncContactMock.mockResolvedValue(contact);

    return expect(processCommand({ command, organization })).resolves.toEqual(result);
  });

  it('should process the command given a Command SMS Number', () => {
    const commandSmsNumber: string = faker.phone.phoneNumber('+##########');
    const completeSmsNumber: string = `+1${commandSmsNumber.substring(1)}`;
    const organization: any = { id: faker.random.uuid() };
    const messageBody: string = faker.lorem.sentence();
    const command: string = `${completeSmsNumber} ${messageBody}`;
    const contact: any = {
      id: faker.random.uuid(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      username: faker.internet.userName(),
      completeSmsNumber,
    };

    const result = {
      completeSmsNumber,
      messageBody,
      type: commandTypes.OUTBOUND_SMS,
      errorMessage: 'Valid command',
      contact,
    };

    const asyncContactMock: any = jest.spyOn(Contact, 'findByValOrCreate');
    asyncContactMock.mockResolvedValue(contact);

    return expect(processCommand({ command, organization })).resolves.toEqual(result);
  });

  it('should process the command given a valid +username prefix', () => {
    const contact: any = {
      id: faker.random.uuid(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      username: faker.internet.userName(),
      completeSmsNumber: faker.phone.phoneNumber('+##########'),
    };
    const messageBody: string = faker.lorem.sentence();
    const command = `+${contact.username} ${messageBody}`;
    const organization = {};
    const result = {
      completeSmsNumber: contact.completeSmsNumber,
      messageBody,
      type: commandTypes.OUTBOUND_SMS,
      errorMessage: 'Valid command',
      contact,
    };

    const asyncContactMock: any = jest.spyOn(Contact, 'findByVal');
    asyncContactMock.mockResolvedValue(contact);

    return expect(processCommand({ command, organization })).resolves.toEqual(result);
  });

  it('should render an invalid response if there is no Contact associated with +username prefix', () => {
    const contact: any = {};
    const messageBody: string = faker.lorem.sentence();
    const command = `+non ${messageBody}`;
    const organization = {};
    const result = {
      completeSmsNumber: '',
      messageBody,
      type: commandTypes.INVALID,
      errorMessage: 'Unknown username',
      contact,
    };

    const asyncContactMock: any = jest.spyOn(Contact, 'findByVal');
    asyncContactMock.mockResolvedValue(null);

    return expect(processCommand({ command, organization })).resolves.toEqual(result);
  });

  it('should process the command given a "dir" prefix', () => {
    const organization = {};
    const command = 'dir';
    const result = {
      type: commandTypes.RENDER_DIRECTORY,
      messageBody: command,
      errorMessage: 'Valid command',
      contact: {},
      completeSmsNumber: '',
    };

    return expect(processCommand({ command, organization })).resolves.toEqual(result);
  });

  it.skip('should process the command given an "add" prefix', () => {
    const organization = {};
    const messageBody: string = faker.lorem.sentence();
    const command = `add ${messageBody}`;
    const result = {
      type: commandTypes.ADD_CONTACT,
      messageBody,
      errorMessage: 'Valid command',
      contact: {},
      completeSmsNumber: '',
    };

    return expect(processCommand({ command, organization })).resolves.toEqual(result);
  });

  it('should process the command given an unknown prefix', () => {
    const organization = {};
    const messageBody: string = faker.lorem.sentence();
    const command = `blah ${messageBody}`;

    const result = {
      type: commandTypes.INVALID,
      messageBody,
      errorMessage: `Error: Unknown command of "${command}"`,
      contact: {},
      completeSmsNumber: '',
    };

    return expect(processCommand({ command, organization })).resolves.toEqual(result);
  });
});
