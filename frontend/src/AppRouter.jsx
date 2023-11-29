import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={"home component"} />
        <Route path="/dashboard" element={"dashboard component"} />
        <Route path="/measure" element={"measure component"} />
        <Route path="*" element={"404"} />
      </Routes>
    </>
  );
}

export default App;
