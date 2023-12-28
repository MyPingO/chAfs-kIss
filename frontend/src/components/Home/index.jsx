import { useState } from "react";
import BadInputs from "./BadInputs";

function Home() {
  const [badInputs, setBadInputs] = useState(new Set());
  return (
    <div className="flex flex-col-reverse md:justify-evenly md:flex-row">
      <div className="">left side</div>
      <div className="flex flex-col items-center">
        <BadInputs inputs={badInputs} setInputs={setBadInputs} />
      </div>
    </div>
  );
}

export default Home;
