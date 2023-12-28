import { useState } from "react";

import BadInputs from "./BadInputs";
import ResponseArea from "./ResponseArea";

function Home() {
  const [badInputs, setBadInputs] = useState(new Set());
  return (
    <div className="flex flex-col ml-2 mr-2 h-5/6 justify-between md:justify-evenly md:flex-row">
      <div className="w-full h-full mr-2">
        <ResponseArea />
      </div>
      <div className="flex flex-col w-full max-h-72 overflow-scroll items-center md:items-start sm:max-h-max">
        <BadInputs inputs={badInputs} setInputs={setBadInputs} />
      </div>
    </div>
  );
}

export default Home;
