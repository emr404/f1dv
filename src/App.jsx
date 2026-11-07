import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./components/Navigation";
import Drivers from "./components/Drivers";
import Result from "./components/Result";
import Standings from "./components/Standings";
import Schedule from "./components/Schedule";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Nav />
        <main id="main-content" className="main-content" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Result />} />
            <Route path="/Drivers" element={<Drivers />} />
            <Route path="/Standings" element={<Standings />} />
            <Route path="/Schedule" element={<Schedule />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}
