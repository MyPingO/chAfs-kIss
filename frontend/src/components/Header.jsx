import { Link } from "react-router-dom";

function Header() {
  return (
    <header>
      <div className="flex justify-evenly items-center h-24 font-inter">
        <Link to={"/about"} className="font-Inter">
          About
        </Link>
        <Link to={"/pricing"} className="">
          Pricing
        </Link>
        <Link to={"/"} className="font-kuashan text-sky-400 text-3xl">
          {"chAf's kIss"}
        </Link>
        <Link to={"/contact"} className="">
          Contact
        </Link>
        <Link to={"/terms"} className="">
          Terms
        </Link>
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
