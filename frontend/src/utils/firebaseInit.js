import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA94jz1HhOBv7i6H4aka48AEfZ-WVcknTc",
  authDomain: "chafs-kiss.firebaseapp.com",
  projectId: "chafs-kiss",
  storageBucket: "chafs-kiss.appspot.com",
  messagingSenderId: "272266851178",
  appId: "1:272266851178:web:2a7c27c6aae5d7e6fbab13",
  measurementId: "G-PPT8ZXQY7W",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function addUserToFirestore(uid) {
  try {
    // Reference to the users collection
    const user = auth.currentUser;
    const userDocRef = doc(db, "users", user.uid);

    // Set document data with UID as the document ID and coin_count field with value 0
    // await usersCollection.doc(uid).set({
    //   coin_count: 0,
    // });

    console.log(`User with UID ${uid} added to Firestore successfully.`);
  } catch (error) {
    console.error("Error adding user to Firestore:", error);
  }
}

onAuthStateChanged(auth, () => {
  console.log("user was logged in", auth.currentUser);
  console.log(db, "ze db");
});

export { auth, addUserToFirestore };
