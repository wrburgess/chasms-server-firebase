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