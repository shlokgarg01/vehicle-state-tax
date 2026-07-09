import "./firebaseAdmin.js";
import { getStorage } from "firebase-admin/storage";
import { getApp } from "firebase-admin/app";

const bucket = getStorage(getApp()).bucket();
export default bucket;
