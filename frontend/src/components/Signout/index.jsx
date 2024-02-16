import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebaseInit";

export default function Signout() {
  signOut(auth);
  window.location = "/login";
  return;
}
