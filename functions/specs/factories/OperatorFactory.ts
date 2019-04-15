import * as faker from 'faker';

class OperatorFactory {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  completeSmsNumber: string;
  email: string;
  slackUserName: string;

  constructor({
    id = faker.random.uuid(),
    firstName = faker.name.firstName(),
    lastName = faker.name.lastName(),
    username = faker.internet.userName(),
    completeSmsNumber = faker.phone.phoneNumber('+1#########'),
    email = faker.internet.email(),
    slackUserName = faker.internet.userName(),
  }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.completeSmsNumber = completeSmsNumber;
    this.email = email;
    this.slackUserName = slackUserName;
  }
}

export default OperatorFactory;
