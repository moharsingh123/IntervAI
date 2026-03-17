


import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "intervai-fda66.firebaseapp.com",
  projectId: "intervai-fda66",
  storageBucket: "intervai-fda66.firebasestorage.app",
  messagingSenderId: "229052335492",
  appId: "1:229052335492:web:94cd905d4f2bb989aac9d1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// enable authentication and export the auth instance 

const auth= getAuth(app);
const provider= new GoogleAuthProvider();
export {auth , provider};
