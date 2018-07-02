import * as admin from 'firebase-admin';

class User {
  accessUser(values) {
    if (values) {
      let id;
      for (id in values);
      return values[id];
    }

    return null;
  }

  static create(attrs) {
    const {
      chatUsername,
      email,
      firstName,
      lastName,
      smsNumber,
      username
    } = attrs;

    const db = admin.firestore();
    const docRef = db.collection('users');

    docRef.add({
      chatUsername,
      email,
      firstName,
      lastName,
      smsNumber,
      username,
    });
  }

  static async all() {
    try {
      const db = admin.firestore();
      const collectionRef = db.collection('users').orderBy('lastName');
      const querySnapshot = await collectionRef.get();

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
    const { field, val } = attrs;

    try {
      const db = admin.firestore();
      const collectionRef = db.collection('users').where(field, '==', val).limit(1);
      const querySnapshot = await collectionRef.get();

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
    const { field, val } = attrs;

    try {
      const db = admin.firestore();
      const docRef = db.collection('users');
      const users = await docRef.where(field, '==', val);

      return users;
    } catch (err) {
      console.error('User > findByVal: ', err);
      return null;
    }
  }
}

export default User;
