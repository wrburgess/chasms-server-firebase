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

class SlackRequestFactory {
  token: string;
  team_id: string;
  team_domain: string;
  channel_id: string;
  channel_name: string;
  user_id: string;
  user_name: string;
  command: string;
  text: string;
  response_url: string;
  trigger_id: string;

  constructor({
    token = faker.random.uuid(),
    team_id = faker.random.uuid(),
    team_domain = faker.internet.userName(),
    channel_id = faker.random.uuid(),
    channel_name = 'privategroup',
    user_id = faker.random.uuid(),
    user_name = faker.internet.userName(),
    command = '/sms',
    text = faker.lorem.sentence(),
    response_url = `https://hooks.slack.com/commands/${faker.random.uuid()}`,
    trigger_id = faker.random.uuid(),
  }) {
    this.token = token;
    this.team_id = team_id;
    this.team_domain = team_domain;
    this.channel_id = channel_id;
    this.channel_name = channel_name;
    this.user_id = user_id;
    this.user_name = user_name;
    this.command = command;
    this.text = text;
    this.response_url = response_url;
    this.trigger_id = trigger_id;
  }
}

export default SlackRequestFactory;
