import CopyPublicImageToStorage from '../services/CopyPublicImageToStorage';
import Message from '../models/Message';
import * as crypto from 'crypto';

class AssetManagement {
  static async processMessageAttachments(message: any) {
    const attachmentNumber = Object.keys(message.attachments).length;

    if (message && attachmentNumber > 0) {
      const { id, attachments, author, organization } = message;
      const randomFileName = crypto.randomBytes(16).toString('hex');
      const storagePath = `${organization.id}/images/${randomFileName}.jpg`;

      const keys = Object.keys(attachments);
      for (const key of keys) {
        CopyPublicImageToStorage({
          author,
          id: attachments[key].id,
          messageId: message.id,
          organizationId: message.organization.id,
          publicMediaUrl: attachments[key].sourceUrl,
          sourceType: message.source.type,
          storagePath,
        });

        Message.update({
          organizationId: message.organization.id,
          messageId: id,
          field: `attachments.${attachments[key].id}.storagePath`,
          val: storagePath,
        });
      }
    }
  }
}

export default AssetManagement;
