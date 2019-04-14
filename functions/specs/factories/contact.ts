import * as faker from 'faker';

let contact = {
  id: faker.random.uuid(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  username: faker.internet.userName(),
  completeSmsNumber: faker.phone.phoneNumber('+1##########'),
};

export default contact;
