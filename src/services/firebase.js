import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAuRK0k9efJG38mtDb1QXuF_UBhVjeZ5v4",
    authDomain: "materinal-management-hackathon.firebaseapp.com",
    projectId: "materinal-management-hackathon",
    storageBucket: "materinal-management-hackathon.firebasestorage.app",
    messagingSenderId: "868603154384",
    appId: "1:868603154384:web:b7ded511fbea2f421473d5",
    measurementId: "G-4J8GCSSPSL"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
