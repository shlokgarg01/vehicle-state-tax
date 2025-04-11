import admin from 'firebase-admin';
import fs from 'fs';
const rawData = fs.readFileSync('./src/config/firebase/config.json', 'utf8');
const serviceAccount = JSON.parse(rawData);

import config from '../config.js';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: config.firebase.bucketName,
});

const bucket = admin.storage().bucket();
export default bucket;
