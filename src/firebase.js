// src/firebase.js

// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration for 'nagartaradio-335bb' project
const firebaseConfig = {
  apiKey: "AIzaSyCCirix8JtVXS_wQH3j_noM5cPPDblZW-Q",
  authDomain: "nagartaradio-335bb.firebaseapp.com",
  projectId: "nagartaradio-335bb",
  storageBucket: "nagartaradio-335bb.appspot.com", // FIXED: changed from .firebasestorage.app to .appspot.com
  messagingSenderId: "410461407649",
  appId: "1:410461407649:web:6a0d33a563628ad1c063e0",
  measurementId: "G-QPDMBFNL6C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export { analytics };
