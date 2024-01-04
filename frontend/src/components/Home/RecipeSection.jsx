import PropTypes from "prop-types";

function RecipeSection({ recipeName }) {
  return (
    <div className="card w-full h-full">
      <div className="card-body bg-base-300 w-full h-full">
        <h3 className="card-title">Recipie for Meal {recipeName}</h3>

        <h3>Ingredients</h3>
        <ul>
          {/* pretend theres a loop here to load in elems from an arr */}
          <li>list 1</li>
          <li>list 2</li>
          <li>list 3</li>
        </ul>

        <h3>Recipe</h3>
        <ul>
          {/* pretend theres a loop here to load in elems from an arr */}
          <li>list 1</li>
          <li>list 2</li>
          <li>list 3</li>
        </ul>
      </div>
    </div>
  );
}

RecipeSection.propTypes = {
  recipeName: PropTypes.string.isRequired,
};

export default RecipeSection;
