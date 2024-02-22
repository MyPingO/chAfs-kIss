import { useState } from "react";
import ResponseList from "./ResponseList";
import PropTypes from "prop-types";

function ResponseArea({
  setRecipeIndex,
  setRecipes,
  setInputView,
  responses,
  setResponses,
  badInputs,
}) {
  const [inputLength, setInputLength] = useState(0);
  async function handleSubmit() {
    const foodInput = document.getElementById("food-input");
    const restrictions = [...badInputs];

    if (foodInput.value === "") return;
    foodInput.disabled = true;
    setResponses(["loading"]);

    // setResponses([
    //   "Sesame Chicken",
    //   "Chicken Lo Mein",
    //   "Shrimp Fried Rice",
    //   "Hot and Sour Soup",
    // ]);

    const server_url = import.meta.env.VITE_SERVER_URL;

    const data = fetch(`${server_url}/generate_meals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: foodInput.value,
        restrictions: restrictions,
      }),
    });

    try {
      const res = await data;
      const resData = await res.json();
      setResponses(resData.response);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="join join-vertical w-full h-full">
      <div className="join-item">
        <div className="join w-full">
          <label className="flex flex-col w-full">
            <textarea
              className="input w-full input-bordered join-item h-[4.5rem] resize-none"
              rows={3}
              style={{
                borderTopRightRadius: "0px",
                borderBottomLeftRadius: ".5rem",
              }}
              placeholder="What would you like to eat?"
              id="food-input"
              maxLength="351"
              onInput={e => {
                const newInputLength = e.target.value.length;
                const input = e.target;
                setInputLength(newInputLength);

                if (inputLength === 349) {
                  input.classList.add("textarea-error");
                } else {
                  input.classList.remove("textarea-error");
                }
              }}
            />
            <span className="label-text-alt mb-2">
              Char Count: {inputLength} / 350
            </span>
          </label>
          <button
            className="btn btn-error rounded-none rounded-tr-lg rounded-br-lg text-white"
            style={{ height: "4.5rem" }}
            onClick={() => {
              const foodInput = document.getElementById("food-input");
              foodInput.disabled = false;
              foodInput.value = "";
              setResponses([]);
              setRecipeIndex(null);
              setRecipes([{}, {}, {}, {}]);
            }}
          >
            Reset
          </button>
        </div>
      </div>
      <div className="join-item flex items-center justify-center bg-base-300 h-5/6">
        {responses.length === 0 ? (
          <button
            className="btn btn-info btn-lg btn-wide text-white"
            onClick={() => handleSubmit()}
          >
            Submit
          </button>
        ) : responses[0] === "loading" ? (
          <>
            <div className="flex items-center">
              <p className="font-bold text-lg ">Thinking</p>
              <span className="loading loading-dots loading-lg mt-2"></span>
            </div>
          </>
        ) : (
          <ResponseList
            responses={responses}
            setInputView={setInputView}
            setRecipeIndex={setRecipeIndex}
          />
        )}
      </div>
    </div>
  );
}

ResponseArea.propTypes = {
  setInputView: PropTypes.func.isRequired,
  responses: PropTypes.array.isRequired,
  setResponses: PropTypes.func.isRequired,
  badInputs: PropTypes.object.isRequired,
  setRecipeIndex: PropTypes.func.isRequired,
  setRecipes: PropTypes.func.isRequired,
};

export default ResponseArea;
