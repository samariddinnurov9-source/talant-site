// npm run check:env  — verifies .env.local before you start the site.
import { readFileSync, existsSync } from 'node:fs';
if (!existsSync('.env.local')) { console.error('Нет файла .env.local (скопируйте .env.example)'); process.exit(1); }
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').filter((l) => l.includes('=') && !l.startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
const need = ['NEXT_PUBLIC_FIREBASE_API_KEY', 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 'NEXT_PUBLIC_FIREBASE_PROJECT_ID', 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', 'NEXT_PUBLIC_FIREBASE_APP_ID', 'FIREBASE_SERVICE_ACCOUNT'];
let bad = 0;
for (const k of need) if (!env[k]) { console.error('Не заполнено:', k); bad++; }
try { const j = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT || '{}'); if (!j.private_key) throw 0; } catch { console.error('FIREBASE_SERVICE_ACCOUNT: нужен JSON ключа в одну строку'); bad++; }
console.log(bad ? `Проблем: ${bad}` : 'Всё заполнено. Не забудьте: npm run firebase:rules');
process.exit(bad ? 1 : 0);
