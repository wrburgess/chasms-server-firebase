# Chasms Server on Firebase

## References

* [Firebase docs](https://firebase.google.com/docs/)
* [ngrok docs](https://ngrok.com/docs)
* [Slack docs - api](https://api.slack.com/)
* [Slack docs - messages](https://api.slack.com/docs/messages)
* [Slack App - settings](https://api.slack.com/apps/A9S81RSSK)
* [Twilio docs - node](https://www.twilio.com/docs/libraries/node)
* [Twilio docs](https://www.twilio.com/docs/)
* [Twilio webhook settings](https://www.twilio.com/console/phone-numbers/PN9cdcec8e5706875057b9443833671a3d)

## Firebase Functions Environment Variables

* `cd functions`
* `firebase functions:config:get > .runtimeconfig.json`
* Note: This file is excluded from git tracking
* To use, require firebase functions in file `const functions = require('firebase-functions');`
* To access values, run `functions.config().chasms.[KEY_VALUE];`

## Testing Locally for Inbound Server Requests

* Install ngrok with `npm install ngrok -g`
* Start up the local express server with `npm run dev`
* Create a tunnel from ngrok to your local express server on the correct port with `ngrok 8080`
* If you have an ngrok account with custom subdomains, use this `ngrok http -subdomain=allaboardapps 8080`
* If you want a little security with your server, use this `ngrok http -subdomain=allaboardapps -auth=username:password 8080` and visitors will need to enter your choice of the username/password combo
* Once both ngrok and express are running locally, you can test the servers via [https://allaboardapps.ngrok.io](https://allaboardapps.ngrok.io). You can point services, such as Twilio webhooks, to routes on this domain for local testing.

## Payloads

### Slack Inbound from Slash Command

```js
{
  reqBody:{
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

## Schemas

### Organization

```js
  {
    abbreviation: String,
    createdAt: Date,
    name: String,
    slackBotToken: String,            // xoxb-33xxxxx965-lsoxxxxxxxxxxxxxxxxxbGTJl
    slackAppWebhook: String,          // https://hooks.slack.com/services/T0FFFXXX/B8MME748Y/S3TcLI2HXXXXXXXXXXXXXXX
    slackChannelId: String,           // G9RMXXXXX
    slackTeamId: String,              // T0FFFXXX
    twilioAccountPhoneNumber: String  // +1234567890
    twilioAuthToken: String,          // 19a7a80933df7b088897XXXXXXXXXXXXX
    twilioSid: String,                // AC777f98cc9160b995bbbXXXXXXXXXXXXXX
    updatedAt: Date,
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
    chatResponse: {
      response_type: String, // in_channel
      text: String
    },
    createdAt: Date,
    messageType: String, // smsInbound
    requestBody: Object,
    sendSms: Boolean, // true
    smsResponse: {
      smsNumber: String, // 9876543210
      body: String,
    },
    status: Number, // 200
    updatedAt: Date,
    validRequest: Boolean,  // true
  }
```

### Asset

```js
  {
    createdAt: Date,
    updatedAt: Date,
    url: String,
    userId: String
  }
```
