import * as admin from "firebase-admin";
import { ORGANIZATIONS, MESSAGES } from "../constants/models";

class Message {
  static async create(attrs) {
    try {
      const message = {
        organizationId: attrs.organizationId,
        channelId: attrs.channelId,
        rawBody: attrs.rawBody,
        formattedBody: attrs.formattedBody,
        attachments: [],
        client: {
          type: attrs.clientType // sms | browser | slack
        },
        author: {
          id: attrs.authorId,
          type: attrs.authorType, // contact | operator
          authorFullName: attrs.authorFullName,
          authorUsername: attrs.authorUsername
        },
        archived: false
      };

      const collectionRef = admin
        .firestore()
        .collection(ORGANIZATIONS)
        .doc(attrs.organizationId)
        .collection(MESSAGES);

      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let id = "";
      for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      const ref = await collectionRef.doc(id).set({
        id,
        ...message,
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
        created_at: admin.firestore.FieldValue.serverTimestamp()
      });

      return ref;
    } catch (err) {
      console.error("Message > create: ", err);
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
        .where(field, "==", val)
        .limit(1)
        .get();

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs.map(docSnapshot => {
          return { id: docSnapshot.id, ...docSnapshot.data() };
        });

        return data[0];
      } else {
        const err = new Error("No results for query");
        throw err;
      }
    } catch (err) {
      console.error("Message > findByVal: ", err);
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
      const querySnapshot = await collectionRef.where(field, "==", val).get();

      return querySnapshot;
    } catch (err) {
      console.error("Message > whereByVal: ", err);
      return null;
    }
  }
}

export default Message;
