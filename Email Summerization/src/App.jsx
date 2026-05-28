import { BrowserRouter, Routes, Route } from "react-router-dom";
import Summaryid from "./components/Summaryid/Summaryid"
import Home from "./components/Home/Home"
import SignUp from "./components/SignUp/SignUp";
import Dashboard from "./components/Dashboard/Dashboard"
import TasksPage from "./components/Taskpage/Taskpage";
import SummaryHistory from "./components/SummaryHistory/SummaryHistory";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/Dashboard" element={<Dashboard/>}/>
        <Route path="/Taskpage" element = {<TasksPage/>}/>
        <Route path="/SummaryHistory" element = {<SummaryHistory/>}/>
          <Route path="/summary/:id"element={<Summaryid />}/>
      </Routes>
    </BrowserRouter>
  );
}