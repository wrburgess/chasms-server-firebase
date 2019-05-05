const charactersAfterCommand = /\s(.*)|dir|add/;

const extractMessageFromCommand: any = function(command: string) {
  if (command.match(charactersAfterCommand)) {
    return command.match(charactersAfterCommand)![0].trim();
  } else {
    return '';
  }
};

export default extractMessageFromCommand;
