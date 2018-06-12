const functions = require('firebase-functions');
const Twilio = require('twilio');
class SmsOutbound {
    constructor() {
        this.service = new Twilio(functions.config().chasms.twilio_sid, functions.config().chasms.twilio_auth_token);
        this.serviceNumber = functions.config().chasms.twilio_account_phone_number;
    }
    sendMessage(req) {
        const message = {
            from: this.serviceNumber,
            to: `1${req.smsNumber}`,
            body: req.body,
        };
        this.service.messages.create(message)
            .then(() => {
            this.service.messages.create(message);
            return null;
        })
            .catch(err => {
            console.error(err);
        });
    }
}
module.exports = SmsOutbound;
//# sourceMappingURL=SmsOutbound.js.map