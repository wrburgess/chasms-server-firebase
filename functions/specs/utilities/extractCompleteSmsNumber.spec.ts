import * as faker from 'faker';
import extractCompleteSmsNumber from '../../src/utilities/extractCompleteSmsNumber';

describe('utilities/extractCompleteSmsNumber', () => {
  it('should extract a Complete SMS Number given a Complete SMS number', () => {
    const completeSmsNumber = faker.phone.phoneNumber('+1##########');
    const command = `${completeSmsNumber} ${faker.lorem.sentence}`;
    expect(extractCompleteSmsNumber(command)).toBe(completeSmsNumber);
  });

  it('should extract a Complete SMS Number given a Command SMS number', () => {
    const commandSmsNumber = faker.phone.phoneNumber('+##########');
    const completeSmsNumber = `+1${commandSmsNumber.substring(1)}`;
    const command = `${commandSmsNumber} ${faker.lorem.sentence}`;
    expect(extractCompleteSmsNumber(command)).toBe(completeSmsNumber);
  });

  it('should return an empty string if a non-compliant SMS Number is prefixed', () => {
    const nonCompliantSmsNumber = faker.phone.phoneNumber('+####');
    const emptyString = '';
    const command = `${nonCompliantSmsNumber} ${faker.lorem.sentence}`;
    expect(extractCompleteSmsNumber(command)).toBe(emptyString);
  });
});
