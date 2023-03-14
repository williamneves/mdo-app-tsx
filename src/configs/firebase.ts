// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app"

import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  getAdditionalUserInfo,
  deleteUser,
  onAuthStateChanged,
  verifyPasswordResetCode,
  confirmPasswordReset,
  updatePassword
} from "firebase/auth"

import { getAnalytics } from "firebase/analytics"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAyt51HUH0hFzNGccNHjamlhVfw-_H7tsE",
  authDomain: "optics-manager.firebaseapp.com",
  projectId: "optics-manager",
  storageBucket: "optics-manager.appspot.com",
  messagingSenderId: "1035945001885",
  appId: "1:1035945001885:web:3dc13f84bc3784a4c7e574",
  measurementId: "G-8FL1NLB140"
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// Initialize Firebase Analytics
let analytics

if (app.name && typeof window !== "undefined") {
  analytics = getAnalytics(app)
}

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app)

// Providers
const providerGoogle = new GoogleAuthProvider()
const providerFacebook = new FacebookAuthProvider()

// Exports
export {
  // Firebase
  auth as authInstance,
  analytics,

  // Providers
  providerGoogle,
  providerFacebook,

  // Methods
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  getAdditionalUserInfo,
  deleteUser,
  onAuthStateChanged,
  verifyPasswordResetCode,
  confirmPasswordReset,
  updatePassword
}
