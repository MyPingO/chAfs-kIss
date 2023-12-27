import { Link } from "react-router-dom";

import CoinInfo from "./CoinInfo";
import ThemeSwitch from "./ThemeSwitch";

function Header() {
  return (
    <header className="flex flex-col items-center">
      <div className="flex justify-evenly items-center h-24 font-inter w-3/4">
        <ThemeSwitch />

        <Link to={"/about"} className="">
          About
        </Link>
        <Link to={"/pricing"} className="">
          Pricing
        </Link>
        <Link
          to={"/"}
          className="font-kuashan text-sky-400 text-2xl sm:text-4xl"
        >
          {"chAf's kIss"}
        </Link>
        <Link to={"/contact"} className="">
          Contact
        </Link>
        <Link to={"/terms"} className="">
          Terms
        </Link>

        <CoinInfo />
      </div>
      <div className="text-center">
        <p className="font-inter">Your AI Cooking Assistant</p>
        <p className="font-bold">
          Perfect for figuring out what to make for ANY occasion!
        </p>
      </div>
    </header>
  );
}

export default Header;
