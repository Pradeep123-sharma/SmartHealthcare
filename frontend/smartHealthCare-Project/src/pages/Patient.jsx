import { useEffect, useState } from "react";
import PatientSidebar from "../components/PatientSidebar"; // Import the Sidebar component
import patientService from '../sevices/patientService'; // Assuming you have a patient service

export default function PatientPage({ user }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard'); // Add state for activeTab

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        // Assuming the service fetches data for the logged-in patient
        const data = await patientService.getPatientDashboard();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch patient data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, []);

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      {user && user.role === 'patient' && <PatientSidebar activeTab={activeTab} setActiveTab={setActiveTab} />}
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Patient Dashboard</h2>

        {loading && <p>Loading dashboard...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {dashboardData && !loading && (
          <>
            {/* Health Summary */}
            <section className="bg-white p-6 rounded-xl shadow mb-6 dark:bg-slate-800">
              <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">Health Summary</h3>
              <p>Status: <span className="font-medium">{dashboardData.healthSummary?.status}</span></p>
              <p>BMI: <span className="font-medium">{dashboardData.bmi?.value} ({dashboardData.bmi?.status})</span></p>
              <p>Blood Group: <span className="font-medium">{dashboardData.bloodGroup?.type}</span></p>
            </section>

            {/* Upcoming Appointments */}
            <section className="bg-white p-6 rounded-xl shadow mb-6 dark:bg-slate-800">
              <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">Upcoming Appointments</h3>
              <ul className="space-y-3">
                {dashboardData.upcomingAppointments?.length > 0 ? (
                  dashboardData.upcomingAppointments.map((appt) => (
                    <li key={appt.id} className="p-3 border rounded-lg flex justify-between items-center dark:border-gray-700">
                      <span>Appointment with {appt.doctor} on {appt.date}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No upcoming appointments.</p>
                )}
              </ul>
            </section>
          </>
        )}
      </main>
    </div>
  );
}