import * as faker from 'faker';

class Contact {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  completeSmsNumber: string;

  constructor({
    id = faker.random.uuid(),
    firstName = faker.name.firstName(),
    lastName = faker.name.lastName(),
    username = faker.internet.userName(),
    completeSmsNumber = faker.phone.phoneNumber('+1##########'),
  }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.completeSmsNumber = completeSmsNumber;
  }
}

export default Contact;
