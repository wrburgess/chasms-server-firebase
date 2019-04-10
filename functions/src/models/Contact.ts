import * as admin from 'firebase-admin';
import { ORGANIZATIONS, CONTACTS } from '../constants/models';

class Contact {
  static async create(attrs) {
    try {
      const collectionRef = admin
        .firestore()
        .collection(ORGANIZATIONS)
        .doc(attrs.organizationId)
        .collection(CONTACTS);

      const docRef = await collectionRef.add({
        ...attrs,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return docRef;
    } catch (err) {
      console.error('User > create: ', err);
      return null;
    }
  }

  static async all({ organizationId }) {
    try {
      const collectionRef = admin
        .firestore()
        .collection(ORGANIZATIONS)
        .doc(organizationId)
        .collection(CONTACTS);
      const querySnapshot = await collectionRef.orderBy('lastName').get();

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs.map(docSnapshot => {
          return { id: docSnapshot.id, ...docSnapshot.data() };
        });

        return data;
      } else {
        const err = new Error('No results for query');
        throw err;
      }
    } catch (err) {
      console.error('User > all: ', err);
      return null;
    }
  }

  static async findByVal({ organizationId, field, val }) {
    try {
      const collectionRef = admin
        .firestore()
        .collection(ORGANIZATIONS)
        .doc(organizationId)
        .collection(CONTACTS);
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
      console.error('User > findByVal: ', err);
      return null;
    }
  }

  static async findById({ organizationId, contactId }) {
    try {
      const db = admin.firestore();
      const query = db
        .collection(ORGANIZATIONS)
        .doc(organizationId)
        .collection(CONTACTS)
        .doc(contactId);
      const docSnapshot = await query.get();

      if (docSnapshot.exists) {
        return { id: docSnapshot.id, ...docSnapshot.data() };
      } else {
        const err = new Error('No results for query');
        throw err;
      }
    } catch (err) {
      console.error('Contact > findById: ', err);
      return null;
    }
  }

  static async whereByVal({ organizationId, field, val }) {
    try {
      const collectionRef = admin
        .firestore()
        .collection(ORGANIZATIONS)
        .doc(organizationId)
        .collection(CONTACTS);
      const querySnapshot = await collectionRef.where(field, '==', val).get();

      return querySnapshot;
    } catch (err) {
      console.error('User > whereByVal: ', err);
      return null;
    }
  }
}

export default Contact;
