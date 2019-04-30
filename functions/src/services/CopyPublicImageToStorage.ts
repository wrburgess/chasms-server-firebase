import * as admin from 'firebase-admin';
import * as request from 'request';
import Asset from '../models/Asset';
import * as assetTypes from '../constants/assetTypes';
import * as fileTypes from '../constants/fileTypes';

const CopyPublicImageToStorage = async ({
  id,
  author,
  messageId,
  organizationId,
  publicMediaUrl,
  sourceType,
  storagePath,
}) => {
  try {
    const bucket = admin.storage().bucket();

    request.head(publicMediaUrl, (headError: any, info: any) => {
      if (headError) {
        return console.error('CopyPublicImageToStorage > request:', headError);
      }

      request(publicMediaUrl)
        .pipe(
          bucket.file(storagePath).createWriteStream({
            private: true,
            metadata: {
              contentType: info.headers['content-type'],
              organizationId,
              sourceType,
            },
          }),
        )
        .on('error', (requestError: any) => {
          console.error('CopyPublicImageToStorage > request:', requestError);
        })
        .on('finish', () => {
          Asset.create({
            author,
            assetType: assetTypes.IMAGE,
            fileType: fileTypes.JPEG,
            id,
            messageId,
            organizationId,
            sourceType,
            sourceUrl: publicMediaUrl,
            storagePath,
            tags: [],
          });
        });
    });
  } catch (err) {
    console.error('CopyPublicImageToStorage:', err);
  }
};

export default CopyPublicImageToStorage;
