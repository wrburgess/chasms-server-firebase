import * as faker from 'faker';
import extractCompleteSmsNumber from '../../src/utilities/extractCompleteSmsNumber';

describe('utilities/extractCompleteSmsNumber', () => {
  it('should extract a Complete SMS Number given a Complete SMS number', () => {
    const completeSmsNumber = faker.phone.phoneNumber('+1##########');
    const command = `${completeSmsNumber} {faker.lorem.sentence}`;
    expect(extractCompleteSmsNumber(command)).toBe(completeSmsNumber);
  });

  it('should extract a Complete SMS Number given a Command SMS number', () => {
    const casualSmsNumber = faker.phone.phoneNumber('+##########');
    const completeSmsNumber = `+1${casualSmsNumber.substring(1)}`;
    const command = `${casualSmsNumber} {faker.lorem.sentence}`;
    expect(extractCompleteSmsNumber(command)).toBe(completeSmsNumber);
  });
});
