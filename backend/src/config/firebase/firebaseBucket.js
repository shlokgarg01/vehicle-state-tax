import admin from "firebase-admin";
import fs from "fs";
// import serviceAccount from "./config.json" assert { type: "json" };
import config from "../config.js";
const serviceAccount = JSON.parse(
  fs.readFileSync("./src/config/firebase/config.json", "utf8")
);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: config.firebase.bucketName,
});

const bucket = admin.storage().bucket();
export default bucket;
