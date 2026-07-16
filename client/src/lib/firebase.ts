import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDa_f_RyhIa62Mgb0dzGezbjD4MEC6QivU",
  authDomain: "finsathi-474c4.firebaseapp.com",
  projectId: "finsathi-474c4",
  storageBucket: "finsathi-474c4.firebasestorage.app",
  messagingSenderId: "44982557850",
  appId: "1:44982557850:web:3a62b669f82d86def69323",
  measurementId: "G-8YMK41MPRK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
