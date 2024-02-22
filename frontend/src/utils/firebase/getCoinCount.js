import { auth, db } from "../firebaseInit";
import { doc, getDoc } from "firebase/firestore";

async function getCoinCount() {
  try {
    const user = auth.currentUser;
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const coinCount = userDocSnap.data().coin_count;
      return coinCount;
    }
  } catch (error) {
    console.error("Error fetching user template: ", error);
  }
}

export { getCoinCount };
