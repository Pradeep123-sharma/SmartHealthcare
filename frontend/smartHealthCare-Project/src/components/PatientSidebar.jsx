import {
  Home,
  Bot,
  Pill,
  MapPin,
  Shield,
  FileText,
  Calendar,
  User,
  Activity,
  Heart
} from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'medicines', label: 'Medicine Finder', icon: Pill },
    { id: 'hospitals', label: 'Hospital Finder', icon: MapPin },
    { id: 'emergency', label: 'Emergency SOS', icon: Shield },
    { id: 'health-records', label: 'Health Records', icon: FileText },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'profile', label: 'Health Profile', icon: User },
    { id: 'vitals', label: 'Health Tracking', icon: Activity }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <Heart className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-gray-900 dark:text-white">SmartHealth</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Patient Portal</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === item.id
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{item.label}</span>
                {item.id === 'emergency' && (
                  <span className="ml-auto h-2 w-2 bg-red-500 rounded-full"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

