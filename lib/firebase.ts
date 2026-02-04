// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYayckEnpn7dlHtfVgOkmfEkkr_79LSpQ",
  authDomain: "blackbook-3d094.firebaseapp.com",
  projectId: "blackbook-3d094",
  storageBucket: "blackbook-3d094.firebasestorage.app",
  messagingSenderId: "617661678418",
  appId: "1:617661678418:web:9392b6fcfd2b036027f08b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();