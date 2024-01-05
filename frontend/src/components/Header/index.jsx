import { Link } from "react-router-dom";

import CoinInfo from "./CoinInfo";
import ThemeSwitch from "./ThemeSwitch";

function Header() {
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
          <Link to={"/terms"} className="">
            Terms
          </Link>

          <ThemeSwitch />
          <CoinInfo />
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
            <li>
              {" "}
              <Link to={"/terms"} className="">
                Terms
              </Link>
            </li>
            <li>
              <Link to={"/pricing"}>🛒 Balance: X </Link>
            </li>
            <li>
              <input
                type="checkbox"
                value="light"
                className="hidden checkbox theme-controller"
                id="theme-control-md"
              />
              <label htmlFor="theme-control-md">🎨 Switch Theme</label>
            </li>
          </ul>
        </details>
      </header>
    </>
  );
}

export default Header;
