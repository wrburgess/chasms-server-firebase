import * as admin from 'firebase-admin';
import { ORGANIZATIONS, ASSETS } from '../constants/models';

class Asset {
  static create(attrs) {
    const {
      organizationId,
      url,
      userId,
    } = attrs;

    const collectionRef = admin.firestore().collection(ORGANIZATIONS).doc(organizationId).collection(ASSETS);

    collectionRef.add({
      url,
      userId,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  static async all(attrs) {
    const { organizationId } = attrs;

    try {
      const docRef = admin.firestore().collection(ORGANIZATIONS).doc(organizationId);
      const query = docRef.collection(ASSETS).orderBy('name');
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
      console.error('Asset > all: ', err);
      return null;
    }
  }

  static async findByVal(attrs) {
    const { organizationId, field, val } = attrs;

    try {
      const docRef = admin.firestore().collection(ORGANIZATIONS).doc(organizationId);
      const query = docRef.collection(ASSETS).where(field, '==', val).limit(1);
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
      console.error('Asset > findByVal: ', err);
      return null;
    }
  }

  static async whereByVal(attrs) {
    const { organizationId, field, val } = attrs;

    try {
      const docRef = admin.firestore().collection(ORGANIZATIONS).doc(organizationId);
      const collectionRef = docRef.collection(ASSETS);
      const query = collectionRef.where(field, '==', val);
      const querySnapshot = await query.get();

      return querySnapshot;
    } catch (err) {
      console.error('Asset > whereByVal: ', err);
      return null;
    }
  }
}

export default Asset;