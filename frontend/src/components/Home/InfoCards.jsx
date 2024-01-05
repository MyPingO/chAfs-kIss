function InfoCards() {
  const titles = [
    "Nutrition Facts",
    "Average Cost",
    "Common Allergens Used",
    "Recipe Stats",
  ];
  return (
    <>
      {titles.map((title, index) => (
        <div
          className="card bg-base-300 mb-2 md:w-80 md:mb-0 overflow-scroll"
          key={index}
        >
          <div className="card-body">
            <h2 className="card-title">{title}</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sapiente
              suscipit modi laboriosam aspernatur quos ut minima enim. Molestias
              ducimus dicta exercitationem suscipit, reiciendis impedit? Veniam
              natus iste blanditiis atque exercitationem?
            </p>
          </div>
        </div>
      ))}
    </>
  );
}

export default InfoCards;
