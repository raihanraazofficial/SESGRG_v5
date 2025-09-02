// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAOc9HsaD1jF7Y4U3HDZFDDv2J7NCZgyM",
  authDomain: "sesg-research-website.firebaseapp.com",
  projectId: "sesg-research-website",
  storageBucket: "sesg-research-website.firebasestorage.app",
  messagingSenderId: "570055796287",
  appId: "1:570055796287:web:a5bc6403fe194e03017a8a",
  measurementId: "G-3MKBDML345"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;