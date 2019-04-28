import * as admin from 'firebase-admin';
import * as crypto from 'crypto';
import * as request from 'request';
import AutoId from '../utilities/AutoId';
import Asset from '../models/Asset';
import * as assetTypes from '../constants/assetTypes';
import * as fileTypes from '../constants/fileTypes';
import * as sourceTypes from '../constants/sourceTypes';

const SaveTwilioImageToStorage = async ({ twilioMediaUrl, organizationId, contact }) => {
  try {
    const bucket = admin.storage().bucket();
    const randomFileName = crypto.randomBytes(16).toString('hex');
    const storagePath = `${organizationId}/images/${randomFileName}.jpg`;

    request.head(twilioMediaUrl, (headError: any, info: any) => {
      if (headError) {
        return console.error('SaveTwilioImageToStorage > request:', headError);
      }

      request(twilioMediaUrl)
        .pipe(
          bucket.file(storagePath).createWriteStream({
            private: true,
            metadata: {
              contentType: info.headers['content-type'],
              organizationId,
            },
          }),
        )
        .on('error', (requestError: any) => {
          console.error('SaveTwilioImageToStorage > request:', requestError);
        })
        .on('finish', () => {
          Asset.create({
            organizationId,
            contact,
            assetType: assetTypes.IMAGE,
            fileType: fileTypes.JPEG,
            id: AutoId.newId(),
            sourceType: sourceTypes.TWILIO,
            sourceUrl: twilioMediaUrl,
            storagePath,
            tags: [],
          });

          // Get download url for stored image
        });
    });
  } catch (err) {
    console.error('services > SaveTwilioImageToStorage:', err);
  }
};

export default SaveTwilioImageToStorage;
