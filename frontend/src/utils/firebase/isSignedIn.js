import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseInit";

function isUserSignedIn() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      user => {
        unsubscribe();
        if (user !== null) {
          resolve(true); // User is signed in
        } else {
          resolve(false); // No user signed in
        }
      },
      error => {
        reject(error); // Error occurred
      },
    );
  });
}

export { isUserSignedIn };
