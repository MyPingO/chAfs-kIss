import { useState } from "react";
import ResponseList from "./ResponseList";

function ResponseArea() {
  const [responses, setResponses] = useState([]);
  function handleSubmit(e) {
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
      <input
        type="text"
        className="input input-bordered w-full join-item"
        placeholder="What would you like to eat?"
      />
      <div className="join-item flex items-center justify-center bg-base-300 dark:text-black h-5/6">
        {responses.length === 0 ? (
          <button
            className="btn btn-info btn-lg btn-wide text-white"
            onClick={() => handleSubmit()}
          >
            Submit
          </button>
        ) : (
          <ResponseList responses={responses} />
        )}
      </div>
    </div>
  );
}

export default ResponseArea;
