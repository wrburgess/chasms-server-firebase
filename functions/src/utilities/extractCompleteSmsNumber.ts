// - Complete SMS Number: Plus, Country Code, and Phone Number (ex: +11234567890)
// - Full SMS Number: Country Code, Area Code, and Phone Number (ex: 11234567890)
// - Command SMS Number: Plus, Area Code, and Phone Number (ex: +7735516808)
// - Casual SMS Number: Area Code and Phone Number (ex: 7735516808)
// - Short SMS Number: Phone Number (ex: 5516808) NOT ALLOWED

const completeSmsNumberAndText = /^\+1\d{10}\ .+$/;
const commandSmsNumberAndText = /^\+\d{10}\ .+$/;
const fullSmsNumber = /\d{11}/;
const casualSmsNumber = /\d{10}/;

const extractCompleteSmsNumber: any = function(command: string) {
  if (completeSmsNumberAndText.test(command)) {
    return `+${command.match(fullSmsNumber)![0]}`;
  } else if (commandSmsNumberAndText.test(command)) {
    return `+1${command.match(casualSmsNumber)![0]}`;
  } else {
    return '';
  }
};

export default extractCompleteSmsNumber;
