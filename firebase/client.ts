import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCHjyJNYFla59cGRwisbw7p4CMZI5-bX1g",
  authDomain: "prepwise-5dd1f.firebaseapp.com",
  projectId: "prepwise-5dd1f",
  storageBucket: "prepwise-5dd1f.firebasestorage.app",
  messagingSenderId: "732070491",
  appId: "1:732070491:web:289211441242dea604757e",
  measurementId: "G-D4J6E70F5Y"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);