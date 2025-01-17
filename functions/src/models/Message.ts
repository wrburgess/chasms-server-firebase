import * as admin from 'firebase-admin';
import { MESSAGES, ORGANIZATIONS } from '../constants/models';

class Message {
  static async create(attrs: any) {
    try {
      const docRef = admin
        .firestore()
        .collection(ORGANIZATIONS)
        .doc(attrs.organization.id)
        .collection(MESSAGES)
        .doc(attrs.id);

      await docRef.set({
        ...attrs,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      });

      const docSnapshot = await docRef.get();

      return { ...docSnapshot.data() };
    } catch (err) {
      console.error('Message > create: ', err);
      return null;
    }
  }

  static async update({ organizationId, messageId, field, val }) {
    try {
      const docRef = admin
        .firestore()
        .collection(ORGANIZATIONS)
        .doc(organizationId)
        .collection(MESSAGES)
        .doc(messageId);

      await docRef.update({
        [field]: val,
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      });

      const document = await docRef.get();
      return document.data();
    } catch (err) {
      console.error('Message > update: ', err);
      return {};
    }
  }

  static async findByVal({ organizationId, field, val }) {
    try {
      const collectionRef = admin
        .firestore()
        .collection(ORGANIZATIONS)
        .doc(organizationId)
        .collection(MESSAGES);
      const querySnapshot = await collectionRef
        .where(field, '==', val)
        .limit(1)
        .get();

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs.map(docSnapshot => {
          return { id: docSnapshot.id, ...docSnapshot.data() };
        });

        return data[0];
      } else {
        const err = new Error('No results for query');
        throw err;
      }
    } catch (err) {
      console.error('Message > findByVal: ', err);
      return null;
    }
  }

  static async whereByVal({ organizationId, field, val }) {
    try {
      const collectionRef = admin
        .firestore()
        .collection(ORGANIZATIONS)
        .doc(organizationId)
        .collection(MESSAGES);
      const querySnapshot = await collectionRef.where(field, '==', val).get();

      return querySnapshot;
    } catch (err) {
      console.error('Message > whereByVal: ', err);
      return null;
    }
  }
}

export default Message;
