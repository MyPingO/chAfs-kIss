import { useState } from "react";

function ResponseArea() {
  const [responses, setResponses] = useState([]);
  return (
    <div className="join join-vertical w-full h-full">
      <input
        type="text"
        className="input input-bordered w-full join-item"
        placeholder="What would you like to eat?"
      />
      <div className="join-item bg-gray-300 dark:text-black sm:h-5/6">
        {responses.length === 0 ? "_" : " hey we not 0 "}
      </div>
    </div>
  );
}

export default ResponseArea;
