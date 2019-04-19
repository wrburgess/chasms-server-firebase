import * as admin from 'firebase-admin';
import { ORGANIZATIONS } from '../constants/models';

class Organization {
  static create({
    abbreviation,
    name,
    slackBotToken,
    slackAppWebhook,
    slackChannelId,
    slackTeamId,
    twilioAccountPhoneNumber,
    twilioAuthToken,
    twilioSid,
  }) {
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

  static async findById({ id }) {
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

  static async findByVal({ field, val }) {
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

  static async whereByVal({ field, val }) {
    try {
      const db = admin.firestore();
      const docRef = db.collection(ORGANIZATIONS);
      const organizations = await docRef.where(field, '==', val);

      return organizations;
    } catch (err) {
      console.error('Organization > whereByVal: ', err);
      return null;
    }
  }

  static channelFindByVal({ organization, field, val }) {
    const keys = Object.keys(organization.channels).filter(key => {
      console.log('organization.channels[key]', organization.channels[key]);
      console.log('organization.channels[key][field]', organization.channels[key][field]);
      console.log('val', val);
      return organization.channels[key] && organization.channels[key][field] === val;
    });

    console.log('organization.channels', organization.channels);
    return organization.channels[keys[0]];
  }

  static async findBySlackChannelId(channel_id: string) {
    try {
      const db = admin.firestore();
      const collectionRef = db
        .collection(ORGANIZATIONS)
        .where('slackChannelIds', 'array-contains', channel_id)
        .limit(1);
      const querySnapshot = await collectionRef.get();

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs.map(docSnapshot => {
          return { ...docSnapshot.data() };
        });

        return data[0];
      } else {
        return {};
      }
    } catch (err) {
      console.error('Organization > findBySlackChannelId: ', err);
      return null;
    }
  }

  static async findByTwilioAccountPhoneNumber(twilioAccountPhoneNumber: string) {
    try {
      const db = admin.firestore();
      const collectionRef = db
        .collection(ORGANIZATIONS)
        .where('twilioAccountPhoneNumbers', 'array-contains', twilioAccountPhoneNumber)
        .limit(1);
      const querySnapshot = await collectionRef.get();

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs.map(docSnapshot => {
          return { ...docSnapshot.data() };
        });

        return data[0];
      } else {
        return {};
      }
    } catch (err) {
      console.error('Organization > findByTwilioAccountPhoneNumber: ', err);
      return null;
    }
  }
}

export default Organization;
