const charactersAfterCommand = /\s(.*)/;

const extractMessageFromCommand: any = function(command: string) {
  return command.match(charactersAfterCommand)![0].trim();
};

export default extractMessageFromCommand;
