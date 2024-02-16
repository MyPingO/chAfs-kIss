import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import CoinCard from "./CoinCard";
import { stripeCheckout } from "../../utils/stripeCheckout";

export default function Pricing() {
  const [stripe, setStripe] = useState(null);
  const prices = [5, 10, 15];

  useEffect(() => {
    async function fetchStripe() {
      const stripeInstance = await loadStripe(
        "pk_live_51Nb7wcDBTPrDBCweZcQaokr0DACDm5ZG1YLE9f1HpM3q2yFE3ObkVxIXOSyIQyvKU9edGgk7tZvX7qsqNQr9r5Zw00xEDZyYrk",
      );
      setStripe(stripeInstance);
    }

    fetchStripe();
  }, []);
  return (
    <>
      {stripe === null ? (
        <div className="flex h-5/6 justify-center">
          <div className="loading loading-spinner w-28 md:w-32"></div>
        </div>
      ) : (
        <div className="flex flex-row">
          {prices.map((value, index) => (
            <CoinCard
              price={value}
              amount={index}
              description={"asdf "}
              key={index}
            />
          ))}
          <button
            onClick={() => {
              stripeCheckout(import.meta.env.VITE_SERVER_URL, stripe);
            }}
            className="btn btn-secondary"
          >
            go to checkout
          </button>
        </div>
      )}
    </>
  );
}
