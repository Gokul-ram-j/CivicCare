// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCF7H1mfq_lCPwQbIQKKeJeeGd2k6Kp4XE",
  authDomain: "civiccare-ccd46.firebaseapp.com",
  projectId: "civiccare-ccd46",
  storageBucket: "civiccare-ccd46.firebasestorage.app",
  messagingSenderId: "586004359676",
  appId: "1:586004359676:web:1d5ef42de37677c80b6a79",
};

// Initialize Firebase
let auth;
let firestore;

if (getApps().length == 0) {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
  firestore = getFirestore(app);
} else {
  auth = getAuth();
  firestore = getFirestore();
}

export { auth, firestore };
