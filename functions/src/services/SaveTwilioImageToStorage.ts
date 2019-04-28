import * as admin from 'firebase-admin';

const SaveTwilioImageToStorage = async (sourceType, mediaUrl, organization) => {
  try {
    const bucket = admin.storage().bucket();

    const options = {
      destination: `${organization.id}/images/${sourceType}_test001.jpg`,
      private: true,
      metadata: {
        organizationId: organization.id,
        contentType: 'image/jpeg',
      },
    };

    await bucket.upload(mediaUrl, options);
  } catch (err) {
    console.error('services > SaveTwilioImageToStorage', err);
  }
};

export default SaveTwilioImageToStorage;
