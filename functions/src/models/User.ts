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

    const db = admin.database();
    const ref = db.ref('/users');

    ref.push({
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
      const db = admin.database();
      const snapshot = await db.ref('/users').once('value');
      const users = await snapshot.val();
      return users;
    } catch (err) {
      console.error(err);
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
      console.log('user', user);

      return user;
    } catch (err) {
      console.error(err);
    }
  }
}

export default User;
