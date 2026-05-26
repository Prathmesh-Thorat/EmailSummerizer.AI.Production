import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import Stats from '../Stats/Stats';
import DailyOverview from '../DailyOverview/DailyOverview';
import PriorityFocus from '../PriorityFocus/PriorityFocus';
import Footer from '../Footer/Footer';
import './Home.css';



function App() {

  const [data, setData] = useState(null);

  useEffect(() => {

  fetch("http://localhost:8000/summary",{credentials : "include"})
    .then(res => res.json())
    .then(data => {
      setData(data);
    });

}, []);

   if (data === null) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Stats stats={data.stats} />
        <DailyOverview daily={data.overall_summary}/>
        <PriorityFocus impemails={data.important_emails} / >
      </main>
      <Footer />
    </div>
  );
}

export default App;