// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase for client-side
let app: FirebaseApp;

const getFirebaseApp = () => {
    if (typeof window === 'undefined') {
        return null;
    }
    if (!getApps().length) {
        if (firebaseConfig.apiKey) {
            app = initializeApp(firebaseConfig);
        } else {
            console.error("Firebase API key is missing. Firebase has not been initialized.");
            return null;
        }
    } else {
        app = getApp();
    }
    return app;
}

const appInstance = getFirebaseApp();
const auth: Auth | null = appInstance ? getAuth(appInstance) : null;
const db: Firestore | null = appInstance ? getFirestore(appInstance) : null;

export { app, auth, db };