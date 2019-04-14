import * as faker from 'faker';

// {
//   reqBody: {
//     token: 'SDRmZxxxxxxxJAFuE5Dm',
//     team_id: 'T0xxxxxxE1',
//     team_domain: 'allaboardapps',
//     channel_id: 'G9xxxxxH8',
//     channel_name: 'privategroup',
//     user_id: 'U0xxxxxJ3',
//     user_name: 'wrburgess',
//     command: '/sms',
//     text: 'dir',
//     response_url: 'https://hooks.slack.com/commands/T0xxxxxE1/3939xxxxxxx24/5sxxxxxxxxxxxj0FEeGjs',
//     trigger_id: '393xxxxxx4273.1552xxxxxx77.7ca707exxxxxx58c478bdf1xxxxx86'
//   }
// }

let slackRequest = {
  token: faker.random.uuid(),
  team_id: faker.random.uuid(),
  team_domain: faker.internet.userName(),
  channel_id: faker.random.uuid(),
  channel_name: 'privategroup',
  user_id: faker.random.uuid(),
  user_name: faker.internet.userName(),
  command: '/sms',
  text: faker.lorem.sentence(),
  response_url: `https://hooks.slack.com/commands/${faker.random.uuid()}`,
  trigger_id: faker.random.uuid(),
};

export default slackRequest;
