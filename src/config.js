import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
