import * as functions from 'firebase-functions';
import Distribution from '../services/Distribution';
import AssetManagement from '../services/AssetManagement';

export const onMessageCreate = functions.firestore
  .document('organizations/{organizationId}/messages/{messageId}')
  .onCreate(async documentSnapshot => {
    const message = await documentSnapshot.data();

    AssetManagement.processMessageAttachments(message);
    Distribution.processMessage(message);
  });
