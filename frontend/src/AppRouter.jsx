import { Routes, Route } from "react-router-dom";

import Header from "./components/Header/index";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={"home component"} />
        <Route path="/about" element={"about component"} />
        <Route path="/pricing" element={"pricing component"} />
        <Route path="/contact" element={"contact component"} />
        <Route path="/terms" element={"terms component"} />
        <Route path="*" element={"404"} />
      </Routes>
    </>
  );
}

export default App;
