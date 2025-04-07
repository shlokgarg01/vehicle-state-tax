import admin from 'firebase-admin';
import serviceAccount from './config.json' assert { type: 'json' };
import config from '../config.js';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: config.firebase.bucketName,
});

const bucket = admin.storage().bucket();
export default bucket;
