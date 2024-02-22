import PropTypes from "prop-types";

function CoinInfo({ coinCount }) {
  return (
    <div className="join absolute right-10">
      <div className="join-item bg-accent flex item-center">
        <img src="/coin.svg" alt="coin_img" width="40px" />
      </div>
      <span
        className="join-item input input-md text-end w-14 overflow-scroll flex items-center justify-center p-0"
        disabled
      >
        {coinCount < 0 ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          coinCount
        )}
      </span>
    </div>
  );
}

CoinInfo.propTypes = {
  coinCount: PropTypes.number.isRequired,
};

export default CoinInfo;
