import { NavLink } from 'react-router-dom';
import { useTheme } from "../pages/context/theme.context";
import { useAuth } from "../hooks/useAuth";
import { Sun, Moon, LogOut, LogIn } from "lucide-react";

export default function Navbar() {
    const { darkMode, setDarkMode } = useTheme();
    const { isAuthenticated, logout, user } = useAuth();

    const handleThemeToggle = () => {
        setDarkMode(!darkMode);
    };

    return (
        <nav className="flex justify-between items-center p-4 shadow-md          bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
            <h1 className="text-2xl font-bold text-green-600 dark:text-green-400">
                SmartHealth
            </h1>

            <ul className="flex gap-6 text-gray-700 dark:text-gray-200">
                <li><NavLink to="/" className={({ isActive }) => isActive ? "text-green-600 font-bold dark:text-green-400" : ""}>Home</NavLink></li>
                {isAuthenticated && user && user.role === 'doctor' && (
                    <li><NavLink to="/doctor/dashboard" className={({ isActive }) => isActive ? "text-green-600 font-bold dark:text-green-400" : ""}>Doctors</NavLink></li>
                )}
                {isAuthenticated && user && user.role === 'patient' && (
                    <li><NavLink to="/patient" className={({ isActive }) => isActive ? "text-green-600 font-bold dark:text-green-400" : ""}>Patients</NavLink></li>
                )}
                <li><NavLink to="/about" className={({ isActive }) => isActive ? "text-green-600 font-bold dark:text-green-400" : ""}>About</NavLink></li>
            </ul>

            <div className="flex items-center gap-3">
                {/* Authentication Button - Only show logout when authenticated */}
                {isAuthenticated && (
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                )}

                {/* Dark Mode Toggle */}
                <button
                    onClick={handleThemeToggle}
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                    {darkMode ? (
                        <Sun size={20} className="text-yellow-400" />
                    ) : (
                        <Moon size={20} className="text-gray-800" />
                    )}
                </button>
            </div>
        </nav>
    );
}