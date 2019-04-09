import * as admin from 'firebase-admin';
import { ORGANIZATIONS, MESSAGES } from '../constants/models';
import Organization from './Organization';
import Operator from './Operator';
import Contact from './Contact';

class Message {
  static async create(attrs) {
    try {
      const collectionRef = admin
        .firestore()
        .collection(ORGANIZATIONS)
        .doc(attrs.organizationId)
        .collection(MESSAGES);

      const ref = await collectionRef.add({
        ...attrs,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return ref;
    } catch (err) {
      console.error('Message > create: ', err);
      return null;
    }
  }

  static async all(attrs) {
    const { organizationId } = attrs;

    try {
      const collectionRef = admin
        .firestore()
        .collection(ORGANIZATIONS)
        .doc(organizationId)
        .collection(MESSAGES);
      const querySnapshot = await collectionRef.orderBy('createdAt').get();

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
      console.error('Message > all: ', err);
      return null;
    }
  }

  static async findByVal(attrs) {
    const { organizationId, field, val } = attrs;

    try {
      const collectionRef = admin
        .firestore()
        .collection(ORGANIZATIONS)
        .doc(organizationId)
        .collection(MESSAGES);
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
      console.error('Message > findByVal: ', err);
      return null;
    }
  }

  static async whereByVal(attrs) {
    const { organizationId, field, val } = attrs;

    try {
      const collectionRef = admin
        .firestore()
        .collection(ORGANIZATIONS)
        .doc(organizationId)
        .collection(MESSAGES);
      const querySnapshot = await collectionRef.where(field, '==', val).get();

      return querySnapshot;
    } catch (err) {
      console.error('Message > whereByVal: ', err);
      return null;
    }
  }

  static process(organization, document) {
    // needs SMS response?
    if (document.smsResponse.status) {
      console.log('SMS response should be sent');
    }

    // needs Slack response?
    if (document.slackResponse.status) {
      console.log('Slack response should be sent');
    }
    // needs API response?

    // {
    //   "organizationId": "7fHQ0NUh2VsM5dNgupqQ",
    //     "channelId": "5vUY8ASgCiWJXYGueI9B",
    //       "smsInboundNumber": null,
    //         "type": "apiInbound",
    //           "author": {
    //     "id": "ZzxhJ7UH7NQfVink0r6vFN0y39G2",
    //       "type": "operator",
    //         "firstName": "Randy",
    //           "lastName": "Burgess",
    //             "username": "wrburgess",
    //               "smsNumber": "7735516808",
    //                 "email": "wrburgess@gmail.com"
    //   },
    //   "messageBody": {
    //     "raw": "this is a trigger test 1",
    //       "formattedSlack": "this is a test for Slack",
    //         "formattedSms": "this is a test for SMS",
    //           "formattedApi": "this is a test for the API, again"
    //   },
    //   "slackResponse": {
    //     "status": false,
    //       "responseType": "in_channel"
    //   },
    //   "smsResponse": {
    //     "status": false,
    //       "smsNumber": "1234567890"
    //   },
    //   "apiResponse": {
    //     "status": true
    //   },
    //   "tags": ["tag1", "tag2", "tag3"],
    //     "attachments": [],
    //       "archived": false
    // }
  }
}

export default Message;
