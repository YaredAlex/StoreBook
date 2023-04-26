import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
    apiKey: "AIzaSyDF_uRUI6hAATU6Lukv81kXjQ75qowzIHk",
    authDomain: "fir-2-7c2e8.firebaseapp.com",
    projectId: "fir-2-7c2e8",
    storageBucket: "fir-2-7c2e8.appspot.com",
    messagingSenderId: "890934481757",
    appId: "1:890934481757:web:04f48a69960cdba470ceb4",
    measurementId: "G-NZ7SD6Y17T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
