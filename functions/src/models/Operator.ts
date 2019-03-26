import * as admin from "firebase-admin";
import { ORGANIZATIONS, OPERATORS } from "../constants/models";

class Operator {
  static async create(attrs) {
    try {
      const collectionRef = admin
        .firestore()
        .collection(ORGANIZATIONS)
        .doc(attrs.organizationId)
        .collection(OPERATORS);

      const docRef = await collectionRef.add({
        ...attrs,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return docRef;
    } catch (err) {
      console.error("User > create: ", err);
      return null;
    }
  }

  static async all(attrs) {
    try {
      const { organizationId } = attrs;
      const collectionRef = admin
        .firestore()
        .collection(ORGANIZATIONS)
        .doc(organizationId)
        .collection(OPERATORS);
      const querySnapshot = await collectionRef.orderBy("lastName").get();

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs.map(docSnapshot => {
          return { id: docSnapshot.id, ...docSnapshot.data() };
        });

        return data;
      } else {
        const err = new Error("No results for query");
        throw err;
      }
    } catch (err) {
      console.error("User > all: ", err);
      return null;
    }
  }

  static async findByVal(attrs) {
    try {
      const { organizationId, field, val } = attrs;
      const collectionRef = admin
        .firestore()
        .collection(ORGANIZATIONS)
        .doc(organizationId)
        .collection(OPERATORS);
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
      console.error("User > findByVal: ", err);
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
      const querySnapshot = await collectionRef.where(field, "==", val).get();

      return querySnapshot;
    } catch (err) {
      console.error("User > whereByVal: ", err);
      return null;
    }
  }
}

export default Operator;
