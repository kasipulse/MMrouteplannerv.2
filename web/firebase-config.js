// Firebase SDK imports (MODULAR v9+)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkTejW8c3kAkEr0m3fdPxHKjWr01Q8VBQ",
  authDomain: "route-planner-5cadb.firebaseapp.com",
  projectId: "route-planner-5cadb",
  storageBucket: "route-planner-5cadb.firebasestorage.app",
  messagingSenderId: "893421996060",
  appId: "1:893421996060:web:021216fa6d6743b1f5b7d9",
  measurementId: "G-JPDTXHCM13"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
