import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

import { env } from '@/services/env';

let instance: FirebaseFirestore.Firestore;

export const database = () => {
  if (!instance) throw new Error('Firebase is being accessed before instantiated');
  return instance;
};

export const connectFirebase = () => {
  const rawConfig = env('FIREBASE_CONFIG') as string;
  const serviceAccount = JSON.parse(Buffer.from(rawConfig, 'base64').toString('utf8'));

  const firebase = initializeApp({ credential: cert(serviceAccount) });

  instance = getFirestore(firebase);
  instance.settings({ ignoreUndefinedProperties: true });
};

export { firebaseRepository } from './functions';
