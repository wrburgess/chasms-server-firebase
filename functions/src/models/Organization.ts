import * as admin from 'firebase-admin';
import { ORGANIZATIONS } from '../constants/models';

class Organization {
  static create(attrs) {
    const {
      abbreviation,
      name,
      slackBotToken,
      slackAppWebhook,
      slackChannelId,
      slackTeamId,
      twilioAccountPhoneNumber,
      twilioAuthToken,
      twilioSid,
    } = attrs;

    const collectionRef = admin.firestore().collection(ORGANIZATIONS);
    collectionRef.add({
      abbreviation,
      name,
      slackBotToken,
      slackAppWebhook,
      slackChannelId,
      slackTeamId,
      twilioAccountPhoneNumber,
      twilioAuthToken,
      twilioSid,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  static async all() {
    try {
      const db = admin.firestore();
      const query = db.collection(ORGANIZATIONS).orderBy('name');
      const querySnapshot = await query.get();

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
      console.error('Organization > all: ', err);
      return null;
    }
  }

  static async findById(attrs) {
    const { id } = attrs;

    try {
      const docRef = admin
        .firestore()
        .collection(ORGANIZATIONS)
        .doc(id);

      const docSnapshot = await docRef.get();

      if (docSnapshot.exists) {
        return { id: docSnapshot.id, ...docSnapshot.data() };
      } else {
        const err = new Error('No results for query');
        throw err;
      }
    } catch (err) {
      console.error('Organization > findById: ', err);
      return null;
    }
  }

  static async findByVal(attrs) {
    const { field, val } = attrs;

    try {
      const db = admin.firestore();
      const collectionRef = db
        .collection(ORGANIZATIONS)
        .where(field, '==', val)
        .limit(1);
      const querySnapshot = await collectionRef.get();

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
      console.error('Organization > findByVal: ', err);
      return null;
    }
  }

  static async whereByVal(attrs) {
    const { field, val } = attrs;

    try {
      const db = admin.firestore();
      const docRef = db.collection(ORGANIZATIONS);
      const users = await docRef.where(field, '==', val);

      return users;
    } catch (err) {
      console.error('User > whereByVal: ', err);
      return null;
    }
  }
}

export default Organization;
