import * as faker from 'faker';
import extractMessageFromCommand from '../../src/utilities/extractMessageFromCommand';

describe('utilities/extractMessageFromCommand', () => {
  it('should extract a message from a command with Complete SMS number', () => {
    const messageBody = faker.lorem.sentence();
    const completeSmsNumber = faker.phone.phoneNumber('+1##########');
    const command = `${completeSmsNumber} ${messageBody}`;
    expect(extractMessageFromCommand(command)).toBe(messageBody);
  });

  it('should extract a message from a command with a Command SMS number', () => {
    const messageBody = faker.lorem.sentence();
    const commandSmsNumber = faker.phone.phoneNumber('+##########');
    const command = `${commandSmsNumber} ${messageBody}`;
    expect(extractMessageFromCommand(command)).toBe(messageBody);
  });

  it('should extract a message from a command with a username', () => {
    const messageBody = faker.lorem.sentence();
    const username = faker.internet.userName();
    const command = `+${username} ${messageBody}`;
    expect(extractMessageFromCommand(command)).toBe(messageBody);
  });

  it('should return `dir` if a directory request is made', () => {
    const messageBody = 'dir';
    const command = messageBody;
    expect(extractMessageFromCommand(command)).toBe(messageBody);
  });

  it('should return `add` if a directory request is made', () => {
    const messageBody = 'add';
    const command = messageBody;
    expect(extractMessageFromCommand(command)).toBe(messageBody);
  });

  it('should return null if an unknown request is made', () => {
    const emptyString = '';
    const messageBody = 'foo';
    const command = messageBody;
    expect(extractMessageFromCommand(command)).toBe(emptyString);
  });

  it('should return an empty string if no message is present', () => {
    const emptyString = '';
    const username = faker.internet.userName();
    const command = `+${username} ${emptyString}`;
    expect(extractMessageFromCommand(command)).toBe(emptyString);
  });
});
