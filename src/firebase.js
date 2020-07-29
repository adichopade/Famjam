import firebase from 'firebase';

const firebaseApp=firebase.initializeApp({
  apiKey: "AIzaSyBuyj9qi5KTVvYcdBnk6SG76kinVZY-8qI",
  authDomain: "insta-4ef79.firebaseapp.com",
  databaseURL: "https://insta-4ef79.firebaseio.com",
  projectId: "insta-4ef79",
  storageBucket: "insta-4ef79.appspot.com",
  messagingSenderId: "921335425839",
  appId: "1:921335425839:web:c731e7e0be7c93c8f5cfda",
  measurementId: "G-H6JPPR4ZPT"
})
const db=firebaseApp.firestore();
const auth =firebase.auth();
const storage=firebase.storage();

export {db,storage,auth};
