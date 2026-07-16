import * as admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

admin.initializeApp({
  projectId: "finsathi-474c4",
});

export const firebaseAuth = getAuth();
export const db = getFirestore();
