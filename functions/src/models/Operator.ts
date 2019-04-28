import * as admin from 'firebase-admin';
import AutoId from '../utilities/AutoId';
import { ORGANIZATIONS, OPERATORS } from '../constants/models';

class Operator {
  static async create(attrs: any) {
    try {
      const id = AutoId.newId();

      const docRef = admin
        .firestore()
        .collection(ORGANIZATIONS)
        .doc(attrs.organizationId)
        .collection(OPERATORS)
        .doc(id);

      await docRef.set({
        completeSmsNumber: '',
        email: '',
        firstName: '',
        id,
        lastName: '',
        slackUserName: '',
        username: '',
        ...attrs,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      });

      const docSnapshot = await docRef.get();

      return { ...docSnapshot.data() };
    } catch (err) {
      console.error('Operator > create: ', err);
      return null;
    }
  }

  static async all(attrs: any) {
    try {
      const { organizationId } = attrs;
      const collectionRef = admin
        .firestore()
        .collection(ORGANIZATIONS)
        .doc(organizationId)
        .collection(OPERATORS);
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

  static async findByVal(attrs: any) {
    try {
      const { organizationId, field, val } = attrs;
      const collectionRef = admin
        .firestore()
        .collection(ORGANIZATIONS)
        .doc(organizationId)
        .collection(OPERATORS);
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

  static async findByValOrCreate({ organizationId, field, val }) {
    try {
      const collectionRef = admin
        .firestore()
        .collection(ORGANIZATIONS)
        .doc(organizationId)
        .collection(OPERATORS);

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
        return await Operator.create({ organizationId, [field]: val });
      }
    } catch (err) {
      console.error('User > findByValOrCreate: ', err);
      return null;
    }
  }

  static async whereByVal(attrs) {
    try {
      const { organizationId, field, val } = attrs;
      const collectionRef = admin
        .firestore()
        .collection(ORGANIZATIONS)
        .doc(organizationId)
        .collection(OPERATORS);
      const querySnapshot = await collectionRef.where(field, '==', val).get();

      return querySnapshot;
    } catch (err) {
      console.error('User > whereByVal: ', err);
      return null;
    }
  }
}

export default Operator;
