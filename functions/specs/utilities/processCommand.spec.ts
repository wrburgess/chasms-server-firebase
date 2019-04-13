import * as faker from 'faker';
import processCommand from '../../src/utilities/processCommand';
import * as commandTypes from '../../src/constants/commandTypes';
import Contact from '../../src/models/Contact';

describe('utilities/processCommand', () => {
  it('should process the command given a Complete SMS Number', () => {
    const completeSmsNumber: string = faker.phone.phoneNumber('+1##########');
    const organization: any = { id: faker.random.uuid() };
    const command: string = `${completeSmsNumber} ${faker.lorem.sentence()}`;
    const contact: any = {
      id: faker.random.uuid(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      username: faker.internet.userName(),
      completeSmsNumber,
    };

    const result: any = {
      completeSmsNumber,
      type: commandTypes.OUTBOUND_SMS,
      message: 'Valid command',
      contact,
    };

    const asyncContactMock: any = jest.spyOn(Contact, 'findById');
    asyncContactMock.mockResolvedValue(contact);

    return expect(processCommand({ command, organization })).resolves.toEqual(result);
  });

  it('should process the command given a Command SMS Number', () => {
    const commandSmsNumber: string = faker.phone.phoneNumber('+##########');
    const completeSmsNumber: string = `+1${commandSmsNumber.substring(1)}`;
    const organization: any = { id: faker.random.uuid() };
    const command: string = `${commandSmsNumber} ${faker.lorem.sentence()}`;
    const contact: any = {
      id: faker.random.uuid(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      username: faker.internet.userName(),
      completeSmsNumber,
    };

    const result = {
      completeSmsNumber,
      type: commandTypes.OUTBOUND_SMS,
      message: 'Valid command',
      contact,
    };

    const asyncContactMock: any = jest.spyOn(Contact, 'findById');
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
    const command = `+${contact.username} ${faker.lorem.sentence()}`;
    const organization = {};
    const result = {
      completeSmsNumber: contact.completeSmsNumber,
      type: commandTypes.OUTBOUND_SMS,
      message: 'Valid command',
      contact,
    };

    const asyncContactMock: any = jest.spyOn(Contact, 'findByVal');
    asyncContactMock.mockResolvedValue(contact);

    return expect(processCommand({ command, organization })).resolves.toEqual(result);
  });

  it('should render an invalid response if there is no Contact associated with +username prefix', () => {
    const contact: any = {};
    const command = `+non ${faker.lorem.sentence()}`;
    const organization = {};
    const result = {
      completeSmsNumber: '',
      type: commandTypes.INVALID,
      message: 'Unknown username',
      contact,
    };

    const asyncContactMock: any = jest.spyOn(Contact, 'findByVal');
    asyncContactMock.mockResolvedValue(null);

    return expect(processCommand({ command, organization })).resolves.toEqual(result);
  });

  it('should process the command given a "dir" prefix', () => {
    const organization = {};
    const command = `dir ${faker.lorem.words()}`;
    const result = {
      type: commandTypes.RENDER_DIRECTORY,
      message: 'Valid command',
      contact: {},
      completeSmsNumber: '',
    };

    return expect(processCommand({ command, organization })).resolves.toEqual(result);
  });

  it('should process the command given an "add" prefix', () => {
    const organization = {};
    const command = `add ${faker.lorem.words()}`;
    const result = {
      type: commandTypes.ADD_CONTACT,
      message: 'Valid command',
      contact: {},
      completeSmsNumber: '',
    };

    return expect(processCommand({ command, organization })).resolves.toEqual(result);
  });

  it('should process the command given an unknown prefix', () => {
    const organization = {};
    const command = `blah ${faker.lorem.words()}`;
    console.log('command', command);
    const result = {
      type: commandTypes.INVALID,
      message: `Error: Unknown command of "${command}"`,
      contact: {},
      completeSmsNumber: '',
    };

    return expect(processCommand({ command, organization })).resolves.toEqual(result);
  });
});
