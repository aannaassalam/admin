import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDCSN5bv9nEZkg_n8z9utNe7lmEGHJDdBE",
  authDomain: "tridot-2021.firebaseapp.com",
  projectId: "tridot-2021",
  storageBucket: "tridot-2021.appspot.com",
  messagingSenderId: "1062559747429",
  appId: "1:1062559747429:web:9f6eadc29be1db6112a58c",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider(); //enable google-signin pop-up
provider.setCustomParameters({ promt: "selected_account" });
export const signInWithGoogle = () => auth.signInWithPopup(provider);
export default firebase;
