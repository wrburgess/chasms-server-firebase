import extractCompleteSmsNumber from '../../src/utilities/extractCompleteSmsNumber';

it('should extract a Complete SMS Number given a Complete SMS number', () => {
  const command = '+11234567890 this is a test';
  expect(extractCompleteSmsNumber(command)).toBe('1');
});
