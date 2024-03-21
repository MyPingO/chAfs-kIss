import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../utils/firebaseInit";
export default function Login() {
  async function handleLogin() {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider).then(result => {
        const user = result.user;
        user.getIdToken().then(token => {
          const server_url = import.meta.env.VITE_SERVER_URL;
          fetch(`${server_url}/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          })
            .then(res => res.json())
            .then(data => {
              console.log(data);
            })
            .catch(err => console.error(err));
        });
      });
      window.location = "/";
    } catch (error) {
      console.error("Error signing in with Google:", error);
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
