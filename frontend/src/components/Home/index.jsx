import { useState } from "react";

import BadInputs from "./BadInputs";
import ResponseArea from "./ResponseArea";
import RecipeSection from "./RecipeSection";
import InfoCards from "./InfoCards";

function Home() {
  const [inputView, setInputView] = useState(true); // by default true
  const [badInputs, setBadInputs] = useState(new Set());
  const [responses, setResponses] = useState([]);

  const [recipes, setRecipes] = useState([{}, {}, {}, {}]);
  const [recipeIndex, setRecipeIndex] = useState(null); // a number 0-3

  if (inputView) {
    return (
      <div className="flex flex-col ml-2 mr-2 h-5/6 justify-between md:justify-evenly md:flex-row">
        <div className="w-full h-full mr-2">
          <ResponseArea
            responses={responses}
            badInputs={badInputs}
            setResponses={setResponses}
            setInputView={setInputView}
            setRecipeIndex={setRecipeIndex}
            setRecipes={setRecipes}
          />
        </div>
        <div className="flex flex-col w-full max-h-72 overflow-scroll items-center md:items-start sm:max-h-max">
          <BadInputs inputs={badInputs} setInputs={setBadInputs} />
        </div>
      </div>
    );
  } else {
    // have a func here to call to db to setRecipes
    return (
      <div className="flex flex-col ml-2 mr-2 h-5/6 justify-between md:justify-evenly md:flex-row">
        <div className="w-full mb-2 mr-2 h-full md:w-1/3 join join-vertical">
          <RecipeSection
            recipeName={responses[recipeIndex]}
            ingredients={recipes[recipeIndex].ingredients}
            instructions={recipes[recipeIndex].instructions}
            className="join-item"
          />
          <button
            className="btn w-full join-item"
            onClick={() => setInputView(true)}
          >
            Bring me back
          </button>
        </div>
        <div className="flex justify-center items-center flex-col h-full">
          <div className="grid md:grid-cols-2 md:grid-rows-2 md:gap-4 md:justify-items-center mb-2 w-full h-full max-[975px]:flex max-[975px]:flex-col">
            <InfoCards />
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
