import { auth, db } from "../firebaseInit";
import { doc, getDoc } from "firebase/firestore";

async function getUnusedMeals() {
  try {
    const user = auth.currentUser;
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const unused_meals = userDocSnap.data().unused_meals;
      return unused_meals;
    }
  } catch (error) {
    console.error("Error fetching user meals: ", error);
  }
}

export { getUnusedMeals };
