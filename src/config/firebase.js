import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "maendeleo-watch.firebaseapp.com",
  projectId: "maendeleo-watch",
  storageBucket: "maendeleo-watch.firebasestorage.app",
  messagingSenderId: "939709305462",
  appId: "1:939709305462:web:6a44afb2b4109aca264557",
  measurementId: "G-638P77QKVZ", 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);