import * as admin from 'firebase-admin';
import { ORGANIZATIONS, MESSAGES } from '../constants/models';

class Message {
  static async create(attrs) {
    try {
      const collectionRef = admin.firestore().collection(ORGANIZATIONS).doc(attrs.organizationId).collection(MESSAGES);

      const ref = await collectionRef.add({
        ...attrs,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return ref;
    } catch(err) {
      console.error('Message > create: ', err);
      return null;
    }
  }

  static async all(attrs) {
    const { organizationId } = attrs;

    try {
      const collectionRef = admin.firestore().collection(ORGANIZATIONS).doc(organizationId).collection(MESSAGES);
      const querySnapshot = await collectionRef.orderBy('createdAt').get();

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
      const collectionRef = admin.firestore().collection(ORGANIZATIONS).doc(organizationId).collection(MESSAGES);
      const querySnapshot = await collectionRef.where(field, '==', val).limit(1).get();

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
      console.error('Message > findByVal: ', err);
      return null;
    }
  }

  static async whereByVal(attrs) {
    const { organizationId, field, val } = attrs;

    try {
      const collectionRef = admin.firestore().collection(ORGANIZATIONS).doc(organizationId).collection(MESSAGES);
      const querySnapshot = await collectionRef.where(field, '==', val).get();

      return querySnapshot;
    } catch (err) {
      console.error('Message > whereByVal: ', err);
      return null;
    }
  }
}

export default Message;
