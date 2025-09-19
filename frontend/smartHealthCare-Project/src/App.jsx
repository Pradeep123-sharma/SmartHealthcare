import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import About from "./pages/About";
import PatientDashboard from "./pages/Patient";
import DoctorDashboard from "./pages/Doctors";
import { ThemeProvider } from "./context/theme.context";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import { useAuth } from "./hooks/useAuth";
import Auth from "./pages/Auth";

function AppRouter() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        {!isAuthenticated ? (
          // Routes for unauthenticated users
          <>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/about" element={<About />} />
            {/* Redirect protected routes to home */}
            <Route path="/patient" element={<Navigate to="/" replace />} />
            <Route path="/doctor" element={<Navigate to="/" replace />} />
          </>
        ) : (
          // Routes for authenticated users
          <>
            <Route path="/" element={<Home />} />
            <Route path="/patient" element={<PatientDashboard />} />
            <Route path="/doctor" element={<DoctorDashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;

