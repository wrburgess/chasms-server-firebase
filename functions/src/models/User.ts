import * as admin from 'firebase-admin';
import { ORGANIZATIONS, USERS } from '../constants/models';

class User {
  static async create(attrs) {
    const {
      organizationId,
      chatUsername,
      email,
      firstName,
      lastName,
      smsNumber,
      username
    } = attrs;

    try {
      const collectionRef = admin.firestore().collection(ORGANIZATIONS).doc(organizationId).collection(USERS);

      const ref = await collectionRef.add({
        chatUsername,
        email,
        firstName,
        lastName,
        smsNumber,
        username,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return ref;
    } catch (err) {
      console.error('User > create: ', err);
      return null;
    }
  }

  static async all(attrs) {
    const { organizationId } = attrs;

    try {
      const db = admin.firestore().collection(ORGANIZATIONS).doc(organizationId);
      const query = db.collection(USERS).orderBy('lastName');
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
      console.error('User > all: ', err);
      return null;
    }
  }

  static async findByVal(attrs) {
    const { organizationId, field, val } = attrs;

    try {
      const docRef = admin.firestore().collection(ORGANIZATIONS).doc(organizationId);
      const query = docRef.collection(USERS).where(field, '==', val).limit(1);
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
      console.error('User > findByVal: ', err);
      return null;
    }
  }

  static async whereByVal(attrs) {
    const { organizationId, field, val } = attrs;

    try {
      const db = admin.firestore().collection(ORGANIZATIONS).doc(organizationId);
      const collectionRef = db.collection(USERS);
      const query = await collectionRef.where(field, '==', val);

      return query;
    } catch (err) {
      console.error('User > whereByVal: ', err);
      return null;
    }
  }
}

export default User;
