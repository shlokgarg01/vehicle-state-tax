import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import config from "../config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const defaultServiceAccountPath = path.join(__dirname, "config.json");

const resolveServiceAccountPath = () => {
  const configuredPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (!configuredPath) {
    return defaultServiceAccountPath;
  }

  return path.isAbsolute(configuredPath)
    ? configuredPath
    : path.resolve(process.cwd(), configuredPath);
};

const loadServiceAccount = () => {
  const serviceAccountPath = resolveServiceAccountPath();

  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(
      `Firebase service account not found at ${serviceAccountPath}. ` +
        "Set FIREBASE_SERVICE_ACCOUNT_PATH or place config.json in src/config/firebase/."
    );
  }

  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

  if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
    throw new Error(
      "Firebase config.json is missing project_id, client_email, or private_key"
    );
  }

  if (serviceAccount.private_key.includes("\\n")) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
  }

  return serviceAccount;
};

const initializeFirebaseAdmin = () => {
  if (getApps().length) {
    return getApp();
  }

  const serviceAccountPath = resolveServiceAccountPath();
  process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceAccountPath;

  const serviceAccount = loadServiceAccount();

  const app = initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id,
    storageBucket: config.firebase.bucketName,
  });

  console.log(`Firebase Admin initialized for project: ${serviceAccount.project_id}`);

  return app;
};

const app = initializeFirebaseAdmin();

export { app, cert, getApp, getApps, initializeApp };
export default app;
