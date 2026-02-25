import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/App.css";
import Home from "./pages/Home";
import Analyze from "./pages/Analyze";
import AnalyzeReport from "./pages/AnalyzeReport";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <div className="app-root">
        <Navbar />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route path="/analyze-report" element={<AnalyzeReport />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
