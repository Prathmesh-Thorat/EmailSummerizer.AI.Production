import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home/Home"
import SignUp from "./components/SignUp/SignUp";
import Dashboard from "./components/Dashboard/Dashboard"
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />

      </Routes>
    </BrowserRouter>
  );
}