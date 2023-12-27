function CoinInfo() {
  return (
    <div className="join absolute right-10">
      <div className="join-item bg-accent flex item-center">
        <img src="/coin.svg" alt="coin_img" width="40px" />
      </div>
      <span
        className="join-item input input-md text-end w-14 overflow-scroll flex items-center justify-center p-0"
        disabled
      >
        ###
        {/* pull this from db */}
      </span>
    </div>
  );
}

export default CoinInfo;
