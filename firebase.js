import { getDatabase } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import 'firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyAFJXVS67agokw7MjFTwWq87tbV-ZEy_pA",
  authDomain: "gpstracking-c79db.firebaseapp.com",
  databaseURL: "https://gpstracking-c79db-default-rtdb.firebaseio.com",
  projectId: "gpstracking-c79db",
  storageBucket: "gpstracking-c79db.appspot.com",
  messagingSenderId: "421233199157",
  appId: "1:421233199157:web:65a239c786784afcd4497c"
};


const app = initializeApp(firebaseConfig);

// Get a reference to the database
const db = getDatabase(app);

export { app, db };