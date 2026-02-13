// src/lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBKUgWmGsGrcv4sJuTq_rNyC4qEY3a4Og4",
  authDomain: "fixit-4-0.firebaseapp.com",
  databaseURL: "https://fixit-4-0-default-rtdb.firebaseio.com",
  projectId: "fixit-4-0",
  storageBucket: "fixit-4-0.firebasestorage.app",
  messagingSenderId: "350050744969",
  appId: "1:350050744969:web:bafe43cc586eb8efdda458",
  measurementId: "G-65DTKMXCEB"
};

// Initialize only if no app exists
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

// Initialize Analytics only in client side
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };