import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import About from "./pages/About.jsx";
import PatientPage from "./pages/Patient.jsx";

import DoctorDashboard from "./pages/Doctors";
import { ThemeProvider } from "./pages/context/theme.context";
import { AuthProvider, AuthContext } from "./pages/context/AuthContext.jsx";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import { useAuth } from "./hooks/useAuth.jsx";
import Auth from "./pages/Auth";

function AppContent() {
  const { isAuthenticated, isLoading, user } = useAuth(); // Hooks are now called here

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
      <Routes>
        {!isAuthenticated ? (
          // Routes for unauthenticated users
          <>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/about" element={<About />} />
            {/* Redirect protected routes to home */}
            <Route path="/patient" element={<Navigate to="/" replace />} />
            <Route path="/patient/dashboard" element={<Navigate to="/" replace />} />
            <Route path="/doctor" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </>
        ) : (
          // Routes for authenticated users
          <>
            <Route path="/" element={<Home />} />
            {user && user.role === 'patient' && (
              <>
                <Route path="/patient" element={<PatientPage user={user} />} />
                <Route path="/patient/dashboard" element={<PatientPage user={user} />} />
              </>
            )}
            {user && user.role === 'doctor' && (
              <>
                <Route path="/doctor" element={<DoctorDashboard user={user} />} />
                <Route path="/doctor/dashboard" element={<DoctorDashboard user={user} />} />
              </>
            )}
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Navigate to="/" replace />} />
            {/* Fallback for any other authenticated route to go to Home */}
            <Route path="*" element={<Home />} />
          </>
        )}
      </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Navbar />
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;