import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./pages/About";
import PatientDashboard from "./pages/Patient";
import DoctorDashboard from "./pages/Doctors";
import { ThemeProvider } from "./context/theme.context";
import Footer from "./components/Footer";

function App() {
  return (
    <ThemeProvider>
      <Router>
        {/* Navbar stays visible on all pages */}
        <Navbar />
        
        <Routes>
          {/* Landing page */}
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Features />
                <Footer />
              </>
            }
          />

          {/* Other pages → NO Hero/Features */}
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

