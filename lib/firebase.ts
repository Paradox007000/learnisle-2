// lib/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider 
} from "firebase/auth";

import { 
  getStorage 
} from "firebase/storage";

// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDYayckEnpn7dlHtfVgOkmfEkkr_79LSpQ",
  authDomain: "blackbook-3d094.firebaseapp.com",
  projectId: "blackbook-3d094",
  storageBucket: "blackbook-3d094.firebasestorage.app",
  messagingSenderId: "617661678418",
  appId: "1:617661678418:web:9392b6fcfd2b036027f08b"
};

// ✅ Prevent re-initializing in Next.js
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Auth
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// ✅ Storage
export const storage = getStorage(app);
