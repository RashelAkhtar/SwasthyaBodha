import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/App.css";
import Home from "./pages/Home";
import XRay from "./pages/XRay";
import Reports from "./pages/Reports";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import About from "./pages/About";
import { LanguageProvider } from "./context/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="app-root">
          <Navbar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/xray" element={<XRay />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
