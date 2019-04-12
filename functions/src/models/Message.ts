import * as admin from 'firebase-admin';
import { ORGANIZATIONS, MESSAGES } from '../constants/models';

class Message {
  static async create(attrs: any) {
    try {
      const docRef = admin
        .firestore()
        .collection(ORGANIZATIONS)
        .doc(attrs.organization.id)
        .collection(MESSAGES)
        .doc(attrs.id);

      const document = await docRef.set({
        ...attrs,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return document;
    } catch (err) {
      console.error('Message > create: ', err);
      return null;
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
