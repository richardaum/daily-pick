import { firestore } from 'firebase-admin';
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_CONFIG as string, 'base64').toString('utf8'));

export const firebase = initializeApp({ credential: cert(serviceAccount) });

export const database = getFirestore(firebase);

database.settings({
  ignoreUndefinedProperties: true,
});

export type Timestamp = firestore.Timestamp;
