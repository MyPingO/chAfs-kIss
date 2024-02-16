import PropTypes from "prop-types";

function RecipeSection({ recipeName, ingredients, instructions }) {
  return (
    <div className="card w-full h-full">
      <div className="card-body bg-base-300 w-full h-full rounded-t-lg">
        <h3 className="card-title text-2xl">Recipe for: {recipeName}</h3>

        <h3 className="text-lg font-bold">Ingredients</h3>
        <ul className={ingredients !== undefined ? `pl-10 list-decimal` : ""}>
          {ingredients !== undefined ? (
            ingredients.map((ingredient, index) => (
              <li key={index} className="text-lg">
                <a
                  href={`https://www.amazon.com/s?k=${ingredient}&i=amazonfresh`}
                  className="link link-info"
                  target="_blank"
                  rel="noreferrer"
                >
                  {ingredient}
                </a>
              </li>
            ))
          ) : (
            <>
              <li className="skeleton h-5 w-full"></li>
              <div className="divider mt-0"></div>
              <li className="skeleton h-5 w-full"></li>
              <div className="divider mt-0"></div>
              <li className="skeleton h-5 w-full"></li>
            </>
          )}
        </ul>

        <h3>Recipe</h3>
        <ul className={instructions !== undefined ? `pl-5 list-decimal` : ""}>
          {instructions !== undefined ? (
            instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))
          ) : (
            <>
              <li className="skeleton h-5 w-full"></li>
              <div className="divider mt-0"></div>
              <li className="skeleton h-5 w-full"></li>
              <div className="divider mt-0"></div>
              <li className="skeleton h-5 w-full"></li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

RecipeSection.propTypes = {
  recipeName: PropTypes.string.isRequired,
  ingredients: PropTypes.array,
  instructions: PropTypes.array,
};

export default RecipeSection;
