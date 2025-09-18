// Home page for authenticated users
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome to SmartHealthcare
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Your healthcare dashboard is ready
              </p>
            </div>
            <button
              onClick={() => {
                const event = new CustomEvent('demo-logout');
                window.dispatchEvent(event);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 dark:bg-green-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
                Book Appointment
              </h3>
              <p className="text-green-700 dark:text-green-300 mb-4">
                Schedule a consultation with healthcare providers
              </p>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                Book Now
              </button>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Health Records
              </h3>
              <p className="text-blue-700 dark:text-blue-300 mb-4">
                Access and manage your medical history
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                View Records
              </button>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-purple-800 dark:text-purple-200 mb-2">
                Telemedicine
              </h3>
              <p className="text-purple-700 dark:text-purple-300 mb-4">
                Connect with doctors remotely
              </p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
                Start Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}