import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

import { env } from '@/services/env';

const rawConfig = env('FIREBASE_CONFIG') as string;
const serviceAccount = JSON.parse(Buffer.from(rawConfig, 'base64').toString('utf8'));

export const firebase = initializeApp({ credential: cert(serviceAccount) });

export const database = getFirestore(firebase);

database.settings({ ignoreUndefinedProperties: true });
