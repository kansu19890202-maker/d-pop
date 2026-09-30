import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const config = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyDg3dCDx-1xZ1Rsq7kF_x_H9Qt7R00gPpw",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "d-pop-3460a.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "d-pop-3460a",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "d-pop-3460a.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "972121839408",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:972121839408:web:384e79245b88c85ce41af5",
};

export function isFirebaseConfigured() {
  return Boolean(config.apiKey && config.projectId && config.authDomain && config.appId);
}

type FirebaseClients = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
};

let clients: FirebaseClients | null | undefined;

export function getFirebase(): FirebaseClients | null {
  if (!isFirebaseConfigured()) return null;
  if (clients) return clients;
  const app = getApps().length ? getApp() : initializeApp(config);
  clients = {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
    storage: getStorage(app),
  };
  return clients;
}
