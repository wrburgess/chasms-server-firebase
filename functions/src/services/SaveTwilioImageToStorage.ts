import * as admin from 'firebase-admin';
import * as crypto from 'crypto';
import * as request from 'request';
import * as Asset from '../models/Asset';
import * as assetTypes from '../constants/assetTypes';
import AutoId from '../utilities/AutoId';

const SaveTwilioImageToStorage = async ({ url, organization }) => {
  try {
    const bucket = admin.storage().bucket();
    const randomFileName = crypto.randomBytes(16).toString('hex');

    request.head(url, (headError: any, info: any) => {
      if (headError) {
        return console.error('SaveTwilioImageToStorage > request:', headError);
      }

      request(url)
        .pipe(
          bucket.file(`${organization.id}/images/${randomFileName}.jpg`).createWriteStream({
            metadata: {
              public: false,
              contentType: info.headers['content-type'],
              organizationId: organization.id,
            },
          }),
        )
        .on('error', (requestError: any) => {
          // Do something if the upload fails.
          console.error('SaveTwilioImageToStorage > request:', requestError);
        })
        .on('finish', (stuff: any) => {
          Asset.create({
            id: AutoId.newId(),
            url: '',
            sourceUrl: '',
            assetType: assetTypes.IMAGE,
          });
          // Do something when everything is done.
          // Get download url for stored image
          console.log('SaveTwilioImageToStorage > request:', stuff);
        });
    });
  } catch (err) {
    console.error('services > SaveTwilioImageToStorage:', err);
  }
};

export default SaveTwilioImageToStorage;
