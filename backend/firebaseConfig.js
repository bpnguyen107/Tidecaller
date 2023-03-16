import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import { getFirestore, doc, setDoc, addDoc, collection, query } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyBn3N2myYaW7fcbUdwiaSM1lFfDl5zbJQk",
  authDomain: "ggwelost-21cc8.firebaseapp.com",
  databaseURL: "https://ggwelost-21cc8-default-rtdb.firebaseio.com",
  projectId: "ggwelost-21cc8",
  storageBucket: "ggwelost-21cc8.appspot.com",
  messagingSenderId: "905255917279",
  appId: "1:905255917279:web:2d0626fe3286b31d0c3b6a",
  measurementId: "G-C5DZK5B0NK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

//continue with firestore data base
const firestore = getFirestore();


const specialOfTheDay = doc(firestore, 'dailySpecial/2021-09-14');
function writeDailySpecial(){
  const docData = {
    description: 'A delicious vanilla latte',
    price: 3.99,
    milk: 'Whole',
    vegan: false,
  };

  setDoc(specialOfTheDay, docData, {merge: true})
  .then(() => {
    console.log('This value has been written to the database');
  })
  .catch((error) => {
    console.log(error);
  });
}

writeDailySpecial();

function updateFavoriteSpots() {
  const docData = {
    favoriteSpots: ["men", "men"],
  }

  setDoc(specialOfTheDay, docData, {merge: true})
  .then(() => {
    console.log('This value has been written to the database');
  })
  .catch((error) => {
    console.log(error);
  });
}

updateFavoriteSpots();

const ordersCollection = collection(firestore, 'dailySpecial');

async function addANewDocument() {
  const newDoc = await addDoc(ordersCollection, {
    customer: 'Arthur',
    drink: 'Bro',
  });
  console.log(newDoc.id)
}

addANewDocument()

/*
async function queryForDocuments() {
  const customerOrdersQuery = query(
    collection(firestore, 'orders'),
    where('drink', '==', 'Latte'),
    limit(10)
  );

  const querySnapshot = await getDocs(customerOrdersQuery);
  const allDocs = querySnapshot.forEach((snap) => {
    console.log(`Document ${snap.id} contains ${JSON.stringify(snap.data())}`)
  });
}
queryForDocuments();
*/
export {app, auth, firebaseConfig, firestore};