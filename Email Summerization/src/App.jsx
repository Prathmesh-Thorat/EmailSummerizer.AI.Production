import { BrowserRouter, Routes, Route } from "react-router-dom";
import Summaryid from "./components/Summaryid/Summaryid"
import Home from "./components/Home/Home"
import SignUp from "./components/SignUp/SignUp";
import Dashboard from "./components/Dashboard/Dashboard"
import TasksPage from "./components/Taskpage/Taskpage";
import SummaryHistory from "./components/SummaryHistory/SummaryHistory";
import EmailsPage from "./components/EmailsPage/EmailsPage";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Summary" element={<Home />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/" element={<Dashboard/>}/>
        <Route path="/Taskpage" element = {<TasksPage/>}/>
        <Route path="/SummaryHistory" element = {<SummaryHistory/>}/>
          <Route path="/summary/:id"element={<Summaryid />}/>
        <Route path="=/EmailsPage" element ={<EmailsPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}