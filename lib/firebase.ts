import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDRe0KkregHpo-6O41cQ64Twg9-d1ahRRo",
  authDomain: "calvier-rossel.firebaseapp.com",
  projectId: "calvier-rossel",
  storageBucket: "calvier-rossel.firebasestorage.app",
  messagingSenderId: "256735305614",
  appId: "1:256735305614:web:3ec284cc31e1ea57a78edf",
  measurementId: "G-5KN1VTK9E6"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Analytics only run on client
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, db, auth, storage, analytics };
