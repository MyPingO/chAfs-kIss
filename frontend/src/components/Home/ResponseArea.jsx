import ResponseList from "./ResponseList";
import PropTypes from "prop-types";

function ResponseArea({ setInputView, responses, setResponses }) {
  function handleSubmit() {
    const foodInput = document.getElementById("food-input");
    if (foodInput.value === "") return;
    foodInput.disabled = true;
    // do something in the backend with the filters to get back the response ideas
    // for now using dummy data
    setResponses([
      "Sesame Chicken",
      "Chicken Lo Mein",
      "Shrimp Fried Rice",
      "Hot and Sour Soup",
    ]);
  }
  return (
    <div className="join join-vertical w-full h-full">
      <div className="join-item">
        <div className="join w-full">
          <input
            type="text"
            className="input w-full input-bordered join-item"
            style={{ borderTopRightRadius: "0px" }}
            placeholder="What would you like to eat?"
            id="food-input"
          />
          <button
            className="btn btn-error rounded-none rounded-tr-lg text-white"
            onClick={() => {
              location.reload();
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
        ) : (
          <ResponseList responses={responses} setInputView={setInputView} />
        )}
      </div>
    </div>
  );
}

ResponseArea.propTypes = {
  setInputView: PropTypes.func.isRequired,
  responses: PropTypes.array.isRequired,
  setResponses: PropTypes.func.isRequired,
};

export default ResponseArea;
