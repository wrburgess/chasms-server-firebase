import * as admin from 'firebase-admin';
import { ORGANIZATIONS, CONTACTS } from '../constants/models';
import AutoId from '../utilities/AutoId';

class Contact {
  static async create(attrs: any) {
    try {
      const id = AutoId.newId();

      const docRef = admin
        .firestore()
        .collection(ORGANIZATIONS)
        .doc(attrs.organizationId)
        .collection(CONTACTS)
        .doc(id);

      await docRef.set({
        id,
        firstName: '',
        lastName: '',
        username: '',
        completeSmsNumber: '',
        email: '',
        ...attrs,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      });

      const docSnapshot = await docRef.get();

      return { ...docSnapshot.data() };
    } catch (err) {
      console.error('Contact > create: ', err);
      return null;
    }
  }

  static async all({ organizationId }) {
    try {
      const collectionRef = admin
        .firestore()
        .collection(ORGANIZATIONS)
        .doc(organizationId)
        .collection(CONTACTS);
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
      console.error('Contact > all: ', err);
      return null;
    }
  }

  static async findByVal({ organizationId, field, val }) {
    try {
      const collectionRef = admin
        .firestore()
        .collection(ORGANIZATIONS)
        .doc(organizationId)
        .collection(CONTACTS);
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
        return null;
      }
    } catch (err) {
      console.error('Contact > findByVal: ', err);
      return null;
    }
  }

  static async findById({ organizationId, contactId }) {
    try {
      const db = admin.firestore();
      const query = db
        .collection(ORGANIZATIONS)
        .doc(organizationId)
        .collection(CONTACTS)
        .doc(contactId);
      const docSnapshot = await query.get();

      if (docSnapshot.exists) {
        return { id: docSnapshot.id, ...docSnapshot.data() };
      } else {
        return null;
      }
    } catch (err) {
      console.error('Contact > findById: ', err);
      return null;
    }
  }

  static async findByValOrCreate({ organizationId, field, val }) {
    try {
      const collectionRef = admin
        .firestore()
        .collection(ORGANIZATIONS)
        .doc(organizationId)
        .collection(CONTACTS);

      const querySnapshot = await collectionRef
        .where(field, '==', val)
        .limit(1)
        .get();

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs.map(docSnapshot => {
          return { ...docSnapshot.data() };
        });

        return data[0];
      } else {
        return await Contact.create({ organizationId, [field]: val });
      }
    } catch (err) {
      console.error('Contact > findByVal: ', err);
      return null;
    }
  }

  static async whereByVal({ organizationId, field, val }) {
    try {
      const collectionRef = admin
        .firestore()
        .collection(ORGANIZATIONS)
        .doc(organizationId)
        .collection(CONTACTS);
      const querySnapshot = await collectionRef.where(field, '==', val).get();

      return querySnapshot;
    } catch (err) {
      console.error('Contact > whereByVal: ', err);
      return null;
    }
  }

  static async renderDirectoryList(organizationId: string) {
    try {
      const attachments: Array<any> = [];
      const contacts: any = await Contact.all({ organizationId });

      const contactNames = contacts.map(contact => {
        return `${contact.lastName}, ${contact.firstName}`;
      });

      const contactInfo = contacts.map(contact => {
        return `\`+${contact.username}\` or \`+${contact.completeSmsNumber}\``;
      });

      const table: any = {
        fallback: 'Table of Contacts',
        fields: [
          {
            title: 'Contact',
            value: contactNames.join('\n'),
            short: true,
          },
          {
            title: 'Message with /sms',
            value: contactInfo.join('\n'),
            short: true,
          },
        ],
        color: '#0269b7',
      };

      attachments.push(table);
      return attachments;
    } catch (err) {
      console.error('Contact > renderDirectoryList: ', err);
      return null;
    }
  }
}

export default Contact;
