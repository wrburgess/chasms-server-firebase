import * as functions from 'firebase-functions';
import Distribution from '../services/Distribution';

export const onMessageCreate = functions.firestore
  .document('organizations/{organizationId}/messages/{messageId}')
  .onCreate(async documentSnapshot => {
    const message = await documentSnapshot.data();

    Distribution.processMessage(message);
  });
