import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Home from "./components/Home";
import Login from "./components/Login";
import Signout from "./components/Signout";
import Pricing from "./components/Pricing";

import StripeSuccess from "./components/StripeRedirect/Success";
import StripeError from "./components/StripeRedirect/Error";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signout" element={<Signout />} />
        <Route path="/about" element={"about component"} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={"contact component"} />

        <Route path="/stripe-success" element={<StripeSuccess />} />
        <Route path="/stripe-error" element={<StripeError />} />
        <Route path="*" element={"404"} />
      </Routes>
    </>
  );
}

export default App;
