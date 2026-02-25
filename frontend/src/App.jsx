import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/App.css";
import Home from "./pages/Home";
import XRay from "./pages/XRay";
import Reports from "./pages/Reports";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <div className="app-root">
        <Navbar />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/xray" element={<XRay />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
