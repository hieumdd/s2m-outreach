import { Firestore } from '@google-cloud/firestore';

export const firestore = new Firestore()
    .collection('s2m')
    .doc(process.env.FIRESTORE_DB || 'master');
