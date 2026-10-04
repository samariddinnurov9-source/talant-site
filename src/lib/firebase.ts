// Lazy client-side Firebase (so pages can be prerendered without credentials).
import { getApp, getApps, initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export const firebaseConfigured = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

export function fb() {
  const app = getApps().length ? getApp() : initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  });
  const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (typeof window !== 'undefined' && key && !(globalThis as { __ac?: boolean }).__ac) {
    (globalThis as { __ac?: boolean }).__ac = true;
    try { initializeAppCheck(app, { provider: new ReCaptchaV3Provider(key), isTokenAutoRefreshEnabled: true }); } catch { /* already initialised */ }
  }
  return { auth: getAuth(app), db: getFirestore(app), storage: getStorage(app) };
}
