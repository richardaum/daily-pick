import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';

const rawConfig = Buffer.from(process.env.FIREBASE_CONFIG as string, 'base64').toString('utf8');
const credential = JSON.parse(rawConfig);

export const firebase = initializeApp(credential);
export const database = getFirestore(firebase);
