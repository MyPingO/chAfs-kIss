import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../utils/firebaseInit";
export default function Login() {
  async function handleLogin() {
    const provider = new GoogleAuthProvider();

    try {
      const userCredential = await signInWithPopup(auth, provider);
      const lastSignIn = userCredential.user.metadata.lastSignInTime;
      const creationTime = userCredential.user.metadata.creationTime;

      if (lastSignIn === creationTime) {
        // TODO: Add func to create userdoc in firestore on first time login
      }
      window.location = "/";
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div className="w-full h-5/6 flex flex-col items-center justify-center">
      <p className="text-center pb-3">
        You must be logged in to use the app <br />
        Good thing you probably already have a Google account ^_^
      </p>
      <button className="btn" onClick={() => handleLogin()}>
        <img src="/google.svg" alt="G" />
        Login with Google
      </button>
    </div>
  );
}
