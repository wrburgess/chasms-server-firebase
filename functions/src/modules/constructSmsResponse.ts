/**
 * A class to manage SMS responses
 *
 * @param request - Request from express
 * @return a smsResponse object with status, message, and destination
 *
 * @example
 * // no SMS response necessary
 * smsResponse = new SmsResponse(request)
 * {
 *   status: false,
 *   smsNumber: null,
 *   body: '',
 * }
 *
 * @example
 * // SMS response is necessary
 * smsResponse = new SmsResponse(request)
 * {
 *   status: true,
 *   smsNumber: 1234567890,
 *   body: 'this is a message body',
 * }
 */
export default class SmsResponse {
  request: object = {};

  constructor(request: any) {
    this.request = request;
  }

  /**
   * A method to determine if command includes valid SMS destination
   *
   * @param {string} command - message instructions
   * @return {number} the destination SMS number (10 digits)
   *
   * @example
   * // No number extracted
   * getDestination('this is a message body')
   * null
   *
   * @example
   * // SMS response is necessary
   * getDestination('+1234567890 this is a message body')
   * 1234567890
   */
  getDestination(command: string) {
    const commandSplit = command.split('+')[1];
    let destination = '';

    if (commandSplit) {
      [destination] = commandSplit.split(' ');
    }

    return destination;
  }

  /**
   * A method to extract a message body from command
   *
   * @param command - message instructions
   * @return the message body for the response
   *
   * @example
   * // command has no destination prefix
   * command = 'this is a message body'
   * getMessageBody(command)
   * this is a message body
   *
   * @example
   * // command has a destination prefix
   * command = '+1234567890 this is a message body'
   * getMessageBody(command)
   * this is a message body
   */
  getMessageBody(command: string) {
    const message = command.split(/\s(.+)/)[1];
    return message || '';
  }

  instructions() {
    const { command } = this.request.something;
    const smsNumber: string = this.getDestination(command);
    const message: string = this.getMessageBody(command);

    const status = smsNumber && message;

    return {
      status,
      smsNumber,
      message,
    };
  }
}
