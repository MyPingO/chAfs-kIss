import { Link } from "react-router-dom";

import CoinInfo from "./CoinInfo";
import ThemeSwitch from "./ThemeSwitch";

import { useEffect, useState } from "react";
import { isUserSignedIn } from "../../utils/firebase/isSignedIn";
import { getCoinCount } from "../../utils/firebase/getCoinCount";

function Header() {
  const [coinCount, setCoinCount] = useState(-1);
  const [isSignedIn, setIsSignedIn] = useState(false);
  useEffect(() => {
    async function handleLoad() {
      const signedIn = await isUserSignedIn();
      setIsSignedIn(signedIn);
      if (signedIn) {
        const coins = await getCoinCount();
        setCoinCount(coins);
      } else {
        console.log("user wasnt signed in");
      }
    }

    handleLoad();
  }, []);
  return (
    <>
      <header className="hidden flex-col items-center pb-2 md:flex">
        <div className="flex justify-evenly items-center h-24 font-inter w-3/4">
          <Link to={"/about"} className="">
            About
          </Link>
          <Link to={"/pricing"} className="">
            Pricing
          </Link>
          <Link to={"/"} className="font-kuashan text-sky-400 text-5xl">
            {"chAf's kIss"}
          </Link>
          <Link to={"/contact"} className="">
            Contact
          </Link>
          <Link to={"/signout"} className="">
            Sign Out
          </Link>

          <ThemeSwitch />
          {isSignedIn ? <CoinInfo coinCount={coinCount} /> : ""}
        </div>
        <div className="text-center">
          <p className="font-inter">Your AI Cooking Assistant</p>
        </div>
      </header>

      <header className="flex items-center justify-between p-2 md:hidden">
        <Link to={"/"} className="font-kuashan text-sky-400 text-4xl">
          {"chAf's kIss"}
        </Link>

        <details className="dropdown dropdown-end">
          <summary className="m-1 btn btn-primary">Options ⬇️</summary>
          <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
            <li>
              <Link to={"/about"} className="">
                About
              </Link>
            </li>
            <li>
              <Link to={"/contact"} className="">
                Contact
              </Link>
            </li>
            {isSignedIn ? (
              <li>
                <Link to={"/pricing"}>
                  🛒 Balance:{" "}
                  {coinCount < 0 ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    coinCount
                  )}{" "}
                </Link>
              </li>
            ) : (
              ""
            )}
            <li>
              <input
                type="checkbox"
                value="light"
                className="hidden checkbox theme-controller"
                id="theme-control-md"
              />
              <label htmlFor="theme-control-md">🎨 Switch Theme</label>
            </li>
            <li>
              <Link to={"/signout"}>❌ Sign Out </Link>
            </li>
          </ul>
        </details>
      </header>
    </>
  );
}

export default Header;
