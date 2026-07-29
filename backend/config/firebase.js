import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import env from "./env.js";

// Initialize Firebase Admin using environment variables from .env
const app = initializeApp({
  credential: cert({
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: env.FIREBASE_PRIVATE_KEY,
  }),
});

// Export the auth service explicitly so other files can use it easily
export const auth = getAuth(app);
export default app;
