// Import the functions you need from the SDKs you need
import * as firebase from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTm9F1E_7GVObh-D6Rpqxa1tyvM20ymlc",
  authDomain: "dummy-ecommerce-data.firebaseapp.com",
  projectId: "dummy-ecommerce-data",
  storageBucket: "dummy-ecommerce-data.appspot.com",
  messagingSenderId: "390048581790",
  appId: "1:390048581790:web:b5c3a962ae23afeba2538f",
  measurementId: "G-V21Q99F5ZB",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;
