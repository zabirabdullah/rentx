import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBe2dwRogvCNWaxv_yojWePdZAzt9q2ITs",
  authDomain: "rent-x-d9ff9.firebaseapp.com",
  projectId: "rent-x-d9ff9",
  storageBucket: "rent-x-d9ff9.firebasestorage.app",
  messagingSenderId: "501145466028",
  appId: "1:501145466028:web:55b68f9117e35f79b15b09",
  measurementId: "G-RQ3P6GQN9V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
