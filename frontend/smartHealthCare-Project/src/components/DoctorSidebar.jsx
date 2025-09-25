import {
    Home,
    Calendar,
    Users,
    Stethoscope,
    FileText,
    Settings,
    Heart
  } from "lucide-react";
  
  export default function DoctorSidebar({ activeTab, setActiveTab }) {
    const menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'appointments', label: 'Appointments', icon: Calendar },
      { id: 'patients', label: 'My Patients', icon: Users },
      { id: 'consultations', label: 'Consultations', icon: Stethoscope },
      { id: 'records', label: 'Patient Records', icon: FileText },
      { id: 'settings', label: 'Settings', icon: Settings }
    ];
  
    return (
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Heart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-gray-900 dark:text-white">SmartHealth</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Doctor Portal</p>
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
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    );
  }