import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Home from "./components/Home";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
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
