import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/app';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAUipntJ-CBJ1qpWyxEmgD26Ih27a7FCFI",
  authDomain: "bataillenavale-8ff3d.firebaseapp.com",
  databaseURL: "https://bataillenavale-8ff3d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bataillenavale-8ff3d",
  storageBucket: "bataillenavale-8ff3d.appspot.com",
  messagingSenderId: "802489062715",
  appId: "1:802489062715:web:442a34998ada52fb7ad31e",
  measurementId: "G-89035EXW0M"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firestore };
