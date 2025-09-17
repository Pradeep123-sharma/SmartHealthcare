import Sidebar from "../components/Sidebar";

export default function PatientDashboard() {
  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-900">
      <Sidebar />
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Patient Dashboard</h2>

        {/* Upcoming Appointments */}
        <section className="bg-white p-6 rounded-xl shadow mb-6 dark:bg-slate-700 dark:text-rose-200">
          <h3 className="text-lg font-semibold mb-2">Upcoming Appointments</h3>
          <ul className="space-y-3">
            <li className="p-3 border rounded-lg">Dr. Sharma - 15 Sept, 10:00 AM</li>
            <li className="p-3 border rounded-lg">Dr. Mehta - 18 Sept, 2:00 PM</li>
          </ul>
        </section>

        {/* Health Records */}
        <section className="bg-white p-6 rounded-xl shadow dark:bg-slate-700 dark:text-rose-200">
          <h3 className="text-lg font-semibold mb-2">Health Records</h3>
          <ul className="space-y-3">
            <li className="p-3 border rounded-lg">Blood Test - Normal</li>
            <li className="p-3 border rounded-lg">X-Ray - Review Required</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
