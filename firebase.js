import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBCLv3p58cgjp_Aw8fwae-pNESl9UA4_7w",
    authDomain: "smart-college-notice-system.firebaseapp.com",
    projectId: "smart-college-notice-system",
    storageBucket: "smart-college-notice-system.firebasestorage.app",
    messagingSenderId: "112233757067",
    appId: "1:112233757067:web:f79415f98534720244178e",
    measurementId: "G-8CNZECJPL9"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);