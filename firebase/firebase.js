import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrVSjpykpGDREwinGgmhO5yyBrZhcwP4I",
  authDomain: "tiktokclone-1602.firebaseapp.com",
  projectId: "tiktokclone-1602",
  storageBucket: "tiktokclone-1602.appspot.com",
  messagingSenderId: "534379151182",
  appId: "1:534379151182:web:3ec22a47041de99469681f",
  measurementId: "G-1M2SR50J0L"
};
// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// export
export { app, auth, firestore, storage };
