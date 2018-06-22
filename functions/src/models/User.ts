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
      const collectionRef = db.collection('users').orderBy("lastName");
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
      console.error('User > findByVal: ', err);
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

  async findBySmsNumber(smsNumber) {
    try {
      const number = smsNumber.substring(2); // remove leading +1
      const db = admin.database();
      const snapshot = await db.ref('/users')
        .orderByChild('smsNumber')
        .equalTo(number)
        .limitToFirst(1)
        .once('value');

      const values = await snapshot.val();
      const user = this.accessUser(values);

      return user;
    } catch(err) {
      console.error(err);
    }
  }

  async findByDirectoryUsername(username) {
    try {
      const db = admin.database();
      const snapshot = await db.ref('/users')
        .orderByChild('username')
        .equalTo(username)
        .limitToFirst(1)
        .once('value');

      const values = await snapshot.val();
      const user = this.accessUser(values);

      return user;
    } catch (err) {
      console.error(err);
    }
  }

  async findByChatUsername(chatUsername) {
    try {
      const db = admin.database();
      let user: any = {};
      const snapshot = await db.ref('/users')
        .orderByChild('chatUsername')
        .equalTo(chatUsername)
        .limitToFirst(1)
        .once('value');

      const values = await snapshot.val();
      if (values) {
        user = this.accessUser(values);
      } else {
        user.chatUsername = chatUsername;
      }

      return user;
    } catch (err) {
      console.error(err);
    }
  }
}

export default User;
