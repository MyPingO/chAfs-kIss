import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

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

async function addUserToFirestore() {
  try {
    const user = auth.currentUser;
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      await setDoc(userDocRef, {
        coin_count: 0,
      });
    }
  } catch (error) {
    console.error("Error adding user to Firestore:", error);
  }
}

export { auth, db, addUserToFirestore };
