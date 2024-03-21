import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import CoinCard from "./CoinCard";

export default function Pricing() {
  const [stripe, setStripe] = useState(null);
  const prices = [5, 10, 15];
  const descriptions = ["for one", "for two", "for three"];

  useEffect(() => {
    async function fetchStripe() {
      const stripeInstance = await loadStripe(
        "pk_test_51Nb7wcDBTPrDBCwewvTcqwhi1AaQuaaDSLFLa5O0KnNfQbUiVpAdRBX4pHKGNyhE4ZA12V1Vmx1WkrZhtPbJSFq800tuRywYko",
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
        <div className="flex justify-evenly items-center flex-wrap gap-4 h-3/4">
          {prices.map((value, index) => (
            <CoinCard
              price={value}
              amount={index + 1}
              description={descriptions[index]}
              stripe={stripe}
              key={index}
            />
          ))}
        </div>
      )}
    </>
  );
}
