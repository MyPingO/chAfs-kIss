import PropTypes from "prop-types";
import { stripeCheckout } from "../../utils/stripeCheckout";

export default function CoinCard({ price, amount, description, url, stripe }) {
  return (
    <div className="card w-60 sm:w-72 md:w-80 lg:w-[25rem] bg-base-200 overflow-scroll h-min">
      <figure>
        <img
          src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
          alt="Shoes"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-lg md:text-xl">
          {amount} plates [{price} dollars]
        </h2>
        <p>{description}</p>
        <div className="card-actions justify-end">
          <button
            onClick={() => {
              stripeCheckout(stripe);
            }}
            className="btn btn-primary"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

CoinCard.propTypes = {
  price: PropTypes.number.isRequired,
  amount: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  stripe: PropTypes.object.isRequired,
};
