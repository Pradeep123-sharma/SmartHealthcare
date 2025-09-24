import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
// import healthService from "../sevices/healthSevice";
import doctorService from '../sevices/doctorService.js'

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]); // State for doctors list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setLoading(true);
        // Assuming getDoctorDashboard returns today's appointments
        // Using Promise.all to fetch multiple resources concurrently
        const [dashboardData, doctorsData] = await Promise.all([
          doctorService.getDoctorDashboard(),
          doctorService.getDoctors() // This call will now be authenticated
        ]);
        setAppointments(dashboardData?.appointments || []);
        setDoctors(doctorsData || []);
        setError(null);
      } catch (err) {
        setError("Failed to fetch dashboard data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, []);

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-900">
      <Sidebar />
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Doctor Dashboard</h2>

        {loading && <p>Loading dashboard...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Today's Appointments */}
        <section className="bg-white p-6 rounded-xl shadow mb-6 text-white-900 dark:bg-slate-700 dark:text-rose-200">
          <h3 className="text-lg font-semibold mb-2">Today's Appointments</h3>
          <ul className="space-y-3">
            {appointments.length > 0 ? (
              appointments.map((appt) => (
                <li key={appt.id} className="p-3 border rounded-lg flex justify-between items-center">
                  <span>{`${appt.patientName} - ${appt.reason}`}</span>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">Consult</button>
                </li>
              ))
            ) : (
              !loading && <p>No appointments for today.</p>
            )}
          </ul>
        </section>

        {/* Patient Records */}
        <section className="bg-white p-6 rounded-xl shadow dark:bg-slate-700 dark:text-rose-200">
          <h3 className="text-lg font-semibold mb-2">Patient Records</h3>
          <p className="text-gray-600">Search and update patient records.</p>
        </section>

        {/* All Doctors List */}
        <section className="bg-white p-6 rounded-xl shadow mt-6 dark:bg-slate-700 dark:text-rose-200">
          <h3 className="text-lg font-semibold mb-2">All Doctors</h3>
          <ul className="space-y-2">
            {doctors.length > 0 ? (
              doctors.map((doctor) => (
                <li key={doctor._id} className="p-2 border-b">{`${doctor.name} - ${doctor.specialization}`}</li>
              ))
            ) : (
              !loading && <p>No doctors found.</p>
            )}
          </ul>
        </section>
      </main>
    </div>
  );
}
