// Import the functions you need from the SDKs you need
import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6HRRXalQxN1mmJWYfAIJcpoXMljA0tCg",
  authDomain: "seashellseahell-e06ab.firebaseapp.com",
  projectId: "seashellseahell-e06ab",
  storageBucket: "seashellseahell-e06ab.appspot.com",
  messagingSenderId: "227298476787",
  appId: "1:227298476787:web:ebd19a544c006e8a9aad86",
  measurementId: "G-SCDTSN05C3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);



// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);


//example (not actual data)
async function getCities(db) {
    const citiesCol = collection(db, 'cities');
    const citySnapshot = await getDocs(citiesCol);
    const cityList = citySnapshot.docs.map(doc => doc.data());
    return cityList;
  }

export {firebase};