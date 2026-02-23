import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/main.css";
import Home from "./pages/Home";
import Analyze from "./pages/Analyze";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <div className="app-shell">
        <Navbar />
        <main className="page-wrap">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analyze" element={<Analyze />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
