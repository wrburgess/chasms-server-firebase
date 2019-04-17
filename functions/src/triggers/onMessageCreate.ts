import * as functions from 'firebase-functions';
import SlackOutbound from '../services/SlackOutbound';
import SmsOutbound from '../services/SmsOutbound';
import * as slackResponseTypes from '../constants/slackResponseTypes';

export const onMessageCreate = functions.firestore
  .document('organizations/{organizationId}/messages/{messageId}')
  .onCreate((documentSnapshot, context) => {
    const message = documentSnapshot.data();

    if (message && message.smsResponse.status) {
      SmsOutbound.sendMessage(message);
    }

    if (message && message.slackResponse.status) {
      if (message.response_type === slackResponseTypes.EPHEMERAL) {
        SlackOutbound.sendEphemeralMessage(message);
      } else if (message.response_type === slackResponseTypes.IN_CHANNEL) {
        SlackOutbound.sendPublicMessage(message);
      }
    }
  });
