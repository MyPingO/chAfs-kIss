import { Link } from "react-router-dom";

function Header() {
  return (
    <header>
      <div className="bg-red-300 flex justify-evenly items-center h-24">
        <Link to={"/about"} className="">
          About
        </Link>
        <Link to={"/pricing"} className="">
          Pricing
        </Link>
        <Link to={"/"} className="">
          {"chAf's kIss"}
        </Link>
        <Link to={"/contact"} className="">
          Contact
        </Link>
        <Link to={"/terms"} className="">
          Terms
        </Link>
      </div>
      <p>Your AI Cooking Assistant</p>
      <p>Perfect for figuring out what to make for ANY occasion!</p>
    </header>
  );
}

export default Header;
