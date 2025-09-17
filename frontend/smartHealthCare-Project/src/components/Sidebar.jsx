import { Home, Calendar, FileText, User } from "lucide-react";
import { Link } from "react-router-dom";

const links = [
  { name: "Home", icon: <Home size={20} />, path: "/" },
  { name: "Appointments", icon: <Calendar size={20} />, path: "/appointments" },
  { name: "Records", icon: <FileText size={20} />, path: "/records" },
  { name: "Profile", icon: <User size={20} />, path: "/profile" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-green-700 text-white dark:bg-gray-800 dark:text-gray-200 min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-8 text-white dark:text-green-400">SmartHealth</h1>
      <ul className="space-y-6">
        {links.map((link, i) => (
          <li key={i} className="hover:bg-green-600 dark:hover:bg-gray-700 p-2 rounded-lg transition">
            <Link to={link.path} className="flex items-center gap-3">
              {link.icon}
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

