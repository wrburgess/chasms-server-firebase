const admin = require('firebase-admin');

class User {
  static accessUser(values) {
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
    var ref = db.ref('/users');

    ref.push({
      chatUsername,
      email,
      firstName,
      lastName,
      smsNumber,
      username,
    });
  }

  static all() {
    const db = admin.database();

    db.ref('/users').once('value')
      .then(snapshot => {
        return snapshot.val();
      })
      .catch(err => {
        console.error('User.all: ', err);
      });
  }

  findBySmsNumber(smsNumber) {
    const number = smsNumber.substring(2); // remove leading +1
    const db = admin.database();

    db.ref('/users').orderByChild('smsNumber').equalTo(number).limitToFirst(1).once('value')
      .then(snapshot => {
        const values = snapshot.val();
        return this.accessUser(values);
      })
      .catch(err => {
        console.error('User.findBySmsNumber: ', err);
      });
  }

  findByDirectoryUsername(username) {
    const db = admin.database();

    return db.ref('/users').orderByChild('username').equalTo(username).limitToFirst(1).once('value')
      .then(snapshot => {
        const values = snapshot.val();
        return this.accessUser(values);
      })
      .catch(err => {
        console.error('User.findByDirectoryUsername: ', err);
      });
  }

  findByChatUsername(chatUsername) {
    const db = admin.database();
    return db.ref('/users').orderByChild('chatUsername').equalTo(chatUsername).limitToFirst(1).once('value');
  }
}

module.exports = User;
