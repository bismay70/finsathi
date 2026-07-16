import * as admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const firebaseConfig = process.env.FIREBASE_PRIVATE_KEY
  ? {
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    }
  : { projectId: "finsathi-474c4" };

admin.initializeApp(firebaseConfig);

export const firebaseAuth = getAuth();
export const db = getFirestore();
