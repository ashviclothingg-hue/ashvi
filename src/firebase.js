import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDj5soBBSbnk5t3PFWqhxHYWw1FDoSYF8g",
    authDomain: "ashvi-web.firebaseapp.com",
    projectId: "ashvi-web",
    storageBucket: "ashvi-web.firebasestorage.app",
    messagingSenderId: "535458987276",
    appId: "1:535458987276:web:9acef8ac40e348ef871d29",
    measurementId: "G-L4X7J3CJW4"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);