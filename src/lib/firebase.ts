// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth"; // Firebase authentication
// import { getStorage } from "firebase/storage"; // Firebase storage
// const firebaseConfig = {
//   apiKey: "AIzaSyDw6QD9VGS3IYiV6C0szPFMsEkcniGRE4o",
//   authDomain: "real-estate-43720.firebaseapp.com",
//   projectId: "real-estate-43720",
//   storageBucket: "real-estate-43720.appspot.com", // ✅ must be .appspot.com
//   messagingSenderId: "143820258474",
//   appId: "1:143820258474:web:ce0184a0359550bd26e4d3",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app); // Export Firebase Auth instance
// export const storage = getStorage(app); // Export Firebase Storage instance

// export default app;

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Firebase authentication
import { getStorage } from "firebase/storage"; // Firebase storage

const firebaseConfig = {
  apiKey: "AIzaSyDw6QD9VGS3IYiV6C0szPFMsEkcniGRE4o",
  authDomain: "real-estate-43720.firebaseapp.com",
  projectId: "real-estate-43720",
  storageBucket: "real-estate-43720.firebasestorage.app",
  messagingSenderId: "143820258474",
  appId: "1:143820258474:web:ce0184a0359550bd26e4d3",
  measurementId: "G-68PVJ0JNLR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Export Firebase Auth instance
export const storage = getStorage(app); // Export Firebase Storage instance

export default app;

