import ResponseList from "./ResponseList";
import PropTypes from "prop-types";

function ResponseArea({ setInputView, responses, setResponses, badInputs }) {
  async function handleSubmit() {
    const foodInput = document.getElementById("food-input");
    const restrictions = [...badInputs];

    setResponses(["loading"]);
    if (foodInput.value === "") return;
    foodInput.disabled = true;

    const server_url = "https://07wljc9s-8000.use.devtunnels.ms";
    // Hardcoded meal query data
    const mealQueryData = {
      query: foodInput.value,
      restrictions: restrictions,
    };

    const data = fetch(`${server_url}/generate_meals`, {
      method: "POST",
      body: mealQueryData,
    });
    try {
      const res = await data;
      console.log(res);
      return;
      // setResponses(res.response);
    } catch (err) {
      console.log(err, data);
    }
    // setResponses([
    //   "Sesame Chicken",
    //   "Chicken Lo Mein",
    //   "Shrimp Fried Rice",
    //   "Hot and Sour Soup",
    // ]);
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
        ) : responses[0] === "loading" ? (
          <>
            <div className="flex items-center">
              <p className="font-bold text-lg ">Thinking</p>
              <span className="loading loading-dots loading-lg mt-2"></span>
            </div>
          </>
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
  badInputs: PropTypes.object.isRequired,
};

export default ResponseArea;
