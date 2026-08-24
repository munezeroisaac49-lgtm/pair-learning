// Pairly — Firebase configuration
// This file ONLY initializes Firebase.
// Firebase Console → Project settings → General → Your apps → Web app → Config

const firebaseConfig = {
  apiKey: "AIzaSyD1Cm7zDzSjuc1NoeZyXnJ83SVT7w2_dfA",
  authDomain: "pairly-adddf.firebaseapp.com",
  projectId: "pairly-adddf",
  storageBucket: "pairly-adddf.firebasestorage.app",
  messagingSenderId: "494942489452",
  appId: "1:494942489452:web:99d419f19317a156ed0149"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

window.pairlyAuth = firebase.auth();
window.pairlyDb = firebase.firestore();
