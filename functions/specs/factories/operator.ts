import * as faker from 'faker';

let operator = {
  id: faker.random.uuid(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  username: faker.internet.userName(),
  completeSmsNumber: faker.phone.phoneNumber('+1#########'),
  email: faker.internet.email(),
  slackUserName: faker.internet.userName(),
};

export default operator;
