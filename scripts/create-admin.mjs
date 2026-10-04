// Usage: FIREBASE_SERVICE_ACCOUNT_FILE=./serviceAccount.json node scripts/create-admin.mjs <login> <password> "<Name>"
import { readFileSync } from 'node:fs';
import { cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const [, , login, password, name = 'Admin'] = process.argv;
if (!login || !password || password.length < 10) { console.error('Usage: create-admin.mjs <login> <password (10+ chars)> "<Name>"'); process.exit(1); }
const key = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT ?? readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_FILE, 'utf8'));
initializeApp({ credential: cert(key) });
const email = login.includes('@') ? login.toLowerCase() : `${login.toLowerCase().replace(/[^a-z0-9._-]/g, '')}@talant.app`;
const auth = getAuth();
let user;
try { user = await auth.getUserByEmail(email); await auth.updateUser(user.uid, { password }); }
catch { user = await auth.createUser({ email, password, displayName: name }); }
await auth.setCustomUserClaims(user.uid, { role: 'admin' });
await getFirestore().doc(`users/${user.uid}`).set({ name, login, email, role: 'admin', blocked: false, createdAt: FieldValue.serverTimestamp() }, { merge: true });
console.log('ADMIN ready:', email, '(sign out and in again to refresh the token)');
