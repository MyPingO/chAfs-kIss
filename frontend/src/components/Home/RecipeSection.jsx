import PropTypes from "prop-types";

function RecipeSection({ recipeName, ingredients, instructions }) {
  return (
    <div className="card w-full h-full">
      <div className="card-body bg-base-300 w-full h-full rounded-t-lg">
        <h3 className="card-title">Recipie for: {recipeName}</h3>

        <h3>Ingredients</h3>
        <ul>
          {ingredients !== undefined ? (
            ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
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
        <ul>
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
