// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAh7Bp0pUksMQ6gwSAvO1oKTa2Pje518zY",
  authDomain: "dukaan-khaata.firebaseapp.com",
  projectId: "dukaan-khaata",
  storageBucket: "dukaan-khaata.firebasestorage.app",
  messagingSenderId: "71091974606",
  appId: "1:71091974606:web:8efcd20077f614d807bb9f",
  measurementId: "G-G5T3M5X4YP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Analytics should only be initialized in the browser.
// This avoids build-time issues on platforms like Vercel.
let analytics = null;
if (typeof window !== "undefined") {
  // Lazy import so the build environment doesn't evaluate firebase/analytics
  // eslint-disable-next-line no-undef
  import("firebase/analytics").then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });
}

export { app, analytics, db };
