import * as admin from 'firebase-admin';
import { ORGANIZATIONS, MESSAGES } from '../constants/models';

class Message {
  static create(attrs) {
    const {
      organizationId,
      status,
      validRequest,
      sendSms,
      messageType,
      chatResponse,
      smsResponse,
    } = attrs;

    const db = admin.firestore().collection(ORGANIZATIONS).doc(organizationId);
    const docRef = db.collection(MESSAGES);

    docRef.add({
      status,
      validRequest,
      sendSms,
      messageType,
      chatResponse,
      smsResponse,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  static async all(attrs) {
    const { organizationId } = attrs;

    try {
      const db = admin.firestore().collection(ORGANIZATIONS).doc(organizationId);
      const query = db.collection(MESSAGES).orderBy('createdAt');
      const querySnapshot = await query.get();

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs.map((docSnapshot) => {
          return { id: docSnapshot.id, ...docSnapshot.data() };
        });

        return data;
      } else {
        const err = new Error('No results for query');
        throw err;
      }
    } catch (err) {
      console.error('Message > all: ', err);
      return null;
    }
  }

  static async findByVal(attrs) {
    const { organizationId, field, val } = attrs;

    try {
      const db = admin.firestore().collection(ORGANIZATIONS).doc(organizationId);
      const query = db.collection(MESSAGES).where(field, '==', val).limit(1);
      const querySnapshot = await query.get();

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs.map((docSnapshot) => {
          return { id: docSnapshot.id, ...docSnapshot.data() };
        });

        return data[0];
      } else {
        const err = new Error('No results for query');
        throw err;
      }
    } catch (err) {
      console.error({ err });
      return null;
    }
  }

  static async whereByVal(attrs) {
    const { organizationId, field, val } = attrs;

    try {
      const db = admin.firestore().collection(ORGANIZATIONS).doc(organizationId);
      const collectionRef = db.collection(MESSAGES);
      const query = collectionRef.where(field, '==', val);
      const querySnapshot = await query.get();

      return querySnapshot;
    } catch (err) {
      console.error('Message > findByVal: ', err);
      return null;
    }
  }
}

export default Message;
