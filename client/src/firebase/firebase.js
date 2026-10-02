import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBHB8tJXNoIToVEujaNzJ5QBqSPLmnNYeI",
  authDomain: "student-os-13.firebaseapp.com",
  projectId: "student-os-13",
  storageBucket: "student-os-13.firebasestorage.app",
  messagingSenderId: "1036883756936",
  appId: "1:1036883756936:web:6570b7132e78f3dd4d5c3d"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;