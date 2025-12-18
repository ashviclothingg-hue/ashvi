import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBrKeOmlWTAVtMMm7INGqAVFB8_Wjb-DT8",
    authDomain: "ashvi-1f329.firebaseapp.com",
    projectId: "ashvi-1f329",
    storageBucket: "ashvi-1f329.firebasestorage.app",
    messagingSenderId: "124593265756",
    appId: "1:124593265756:web:089fded5aae636fa0f1a99",
    measurementId: "G-R5Z2LMRJZ3"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);