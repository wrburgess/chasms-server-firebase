# Chasms Server on Firebase

## Phone Number Labels

- Complete SMS Number: Plus, Country Code, and Phone Number (ex: +17735516808)
- Full SMS Number: Country Code, Area Code, and Phone Number (ex: 17735516808)
- Command SMS Number: Plus, Area Code, and Phone Number (ex: +7735516808)
- Casual SMS Number: Area Code and Phone Number (ex: 7735516808)
- Short SMS Number: Phone Number (ex: 5516808)

* `Complete` SMS Numbers are used for Contact ID and Channel ID
* `Command` and `Complete` SMS Numbers are used by Operators in chat channels for USA-based numbers
* `Full` and `Casual` SMS Numbers are used by Operators for adding, editing, or searching for Contacts
* `Short` SMS Numbers are not allowed in the system

## References

- [Firebase docs](https://firebase.google.com/docs/)
- [ngrok docs](https://ngrok.com/docs)
- [Slack docs - api](https://api.slack.com/)
- [Slack docs - messages](https://api.slack.com/docs/messages)
- [Slack App - settings](https://api.slack.com/apps/A9S81RSSK)
- [Twilio docs - node](https://www.twilio.com/docs/libraries/node)
- [Twilio docs](https://www.twilio.com/docs/)
- [Twilio webhook settings](https://www.twilio.com/console/phone-numbers/PN9cdcec8e5706875057b9443833671a3d)

## Firebase Functions Environment Variables

- `cd functions`
- `firebase functions:config:get > .runtimeconfig.json`
- Note: This file is excluded from git tracking
- To use, require firebase functions in file `const functions = require('firebase-functions');`
- To access values, run `functions.config().chasms.[KEY_VALUE];`

## Testing Locally for Inbound Server Requests

- Install ngrok with `npm install ngrok -g`
- Start up the local express server with `npm run dev`
- Create a tunnel from ngrok to your local express server on the correct port with `ngrok 8080`
- If you have an ngrok account with custom subdomains, use this `ngrok http -subdomain=allaboardapps 8080`
- If you want a little security with your server, use this `ngrok http -subdomain=allaboardapps -auth=username:password 8080` and visitors will need to enter your choice of the username/password combo
- Once both ngrok and express are running locally, you can test the servers via [https://allaboardapps.ngrok.io](https://allaboardapps.ngrok.io). You can point services, such as Twilio webhooks, to routes on this domain for local testing.

## Handing SMS Number Formats

- Contact, Team, and Channel Ids will include Country Codes (+1)
- Operators will only need to add + prefix, without Country Code, for sending outbound SMS

## Payloads

### Slack Request

```js
{
  reqBody: {
    token: 'SDRmZxxxxxxxJAFuE5Dm',
    team_id: 'T0xxxxxxE1',
    team_domain: 'allaboardapps',
    channel_id: 'G9xxxxxH8',
    channel_name: 'privategroup',
    user_id: 'U0xxxxxJ3',
    user_name: 'wrburgess',
    command: '/sms',
    text: 'dir',
    response_url: 'https://hooks.slack.com/commands/T0xxxxxE1/3939xxxxxxx24/5sxxxxxxxxxxxj0FEeGjs',
    trigger_id: '393xxxxxx4273.1552xxxxxx77.7ca707exxxxxx58c478bdf1xxxxx86'
  }
}
```

### Twilio Request

```js
  {
    ToCountry: 'US',
    MediaContentType0: 'image/jpeg',
    ToState: 'KS',
    SmsMessageSid: 'SMee78795cd6a2fbfcd3962c142ea604a3',
    NumMedia: '1',
    ToCity: '',
    FromZip: '60618',
    SmsSid: 'SMee78795cd6a2fbfcd3962c142ea604a3',
    FromState: 'IL',
    SmsStatus: 'received',
    FromCity: 'CHICAGO',
    Body: 'Test 01',
    FromCountry: 'US',
    To: '+19132988148',
    ToZip: '',
    NumSegments: '1',
    MessageSid: 'SMee78795cd6a2fbfcd3962c142ea604a3',
    AccountSid: 'AC777f98cc9160b995bbbd54844a5cc',
    From: '+17735516808',
    MediaUrl0: 'https://api.twilio.com/2010-04-01/Accounts/xxxxxxxxx/Messages/xxxxxxxxx/Media/xxxxxxxxx',
    ApiVersion: '2010-04-01'
  }
```

## Models

### Organization

```js
  {
    id: String,
    abbreviation: String,
    createdAt: Date,
    updatedAt: Date,
    name: String,
    slackBotToken: String,            // xoxb-33xxxxx965-lsoxxxxxxxxxxxxxxxxxbGTJl
    slackAppWebhook: String,          // https://hooks.slack.com/services/T0FFFXXX/B8MME748Y/S3TcLI2HXXXXXXXXXXXXXXX
    slackChannelId: String,           // G9RMXXXXX
    slackTeamId: String,              // T0FFFXXX
    twilioAccountPhoneNumber: String  // +1234567890
    twilioAuthToken: String,          // 19a7a80933df7b088897XXXXXXXXXXXXX
    twilioSid: String,                // AC777f98cc9160b995bbbXXXXXXXXXXXXXX
    channels: Array                   // [{ id: Number, name: String }]
  }
```

### User

```js
  {
    chatUsername: String,
    createdAt: Date,
    email: String,
    firstName: String,
    lastName: String,
    smsNumber: String,
    updatedAt: Date,
    username: String,
  }
```

### Message

```js
  {
    id: String,
    status: Number, 200 | 403 | 500
    type: String, // functionInbound | smsInbound | slackInbound | firestoreInbound
    requestBody: Object,
    createdAt: Date,
    updatedAt: Date,
    validRequest: Boolean,
    archived: Boolean,
    attachments: Array,
    tags: Array,
    source: {
      type: String // twilio | slack | browserClient
      meta: Object
    },
    author: {
      type: String, // contact | operator
      id: String,
      firstName: String,
      lastName: String,
      username: String,
      smsNumber: String,
      email: String,
    },
    organization: {
      id: String,
      name: String,
    },
    channel: {
      id: Number,
      name: String
    },
    apiResponse: {
      status: Boolean,
      body: String
    },
    slackResponse: {
      status: Boolean,
      response_type: String, // in_channel | ephemeral
      body: String
    },
    smsResponse: {
      status: Boolean,
      smsNumber: String, // 9876543210
      body: String,
    },
  }
```

```
message = {
  id: '8ffcd872-adc8-496f-aca2-a796d8e3f8f0',
  status: 200,
  type: 'slackInbound',
  requestBody: '+Rey62 Maiores dolor ex odit eos sunt itaque est.',
  validRequest: true,
  archived: false,
  attachments: [],
  tags: [],
  source: {
    type: 'slack',
    meta: {
      token: '2d83ce4e-53a3-49af-b81e-92b2d34ebf2a',
      team_id: '93ec9c31-bd27-4263-90b9-e9f59475a218',
      team_domain: 'Burnice70',
      channel_id: '+16489671675',
      channel_name: 'privategroup',
      user_id: '3f839e3b-1165-4f87-a241-410ac2069f01',
      user_name: 'Viviane_Brakus',
      command: '/sms',
      text: '+Rey62 Maiores dolor ex odit eos sunt itaque est.',
      response_url: 'https://hooks.slack.com/commands/6a4cfc1c-8e67-41c3-87bb-a33ed80f30e2',
      trigger_id: '8fe81044-2e1a-410f-8d83-366cbc7b0bd8',
    },
  },
  author: {
    type: 'operator',
    id: '464118e1-ef35-4ae4-87ca-23db5ccf1fd9',
    firstName: 'Lon',
    lastName: 'Gutmann',
    username: 'Dante.Block',
    completeSmsNumber: '+1901546939',
    email: 'Cleora_Jacobson76@yahoo.com',
  },
  organization: {
    id: '396e8bf9-91af-4a17-9f3f-76aee11ccf90',
    name: 'Renner - Hayes',
  },
  channelResponse: { body: '', id: '', name: '', status: false },
  apiResponse: { status: false, body: '' },
  slackResponse: {
    body: 'Unknown username for command: +Rey62 Maiores dolor ex odit eos sunt itaque est.',
    channel_id: '+16489671675',
    response_type: 'ephemeral',
    status: true,
    token: '2d83ce4e-53a3-49af-b81e-92b2d34ebf2a',
  },
  smsResponse: { body: '', completeSmsNumber: '', contact: {}, status: false },
};
```

### Asset

```js
  {
    organization: Object,
    author: Object,
    messageId: String,
    createdAt: Date,
    updatedAt: Date,
    url: String,
    type: String, // image | video | document
    fileType: String, // mp3 | mp4 | jpeg | gif | png
    tags: Array,
  }
```
