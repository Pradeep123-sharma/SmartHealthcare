import Sidebar from "../components/Sidebar";

export default function DoctorDashboard() {
  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-900">
      <Sidebar />
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Doctor Dashboard</h2>

        {/* Today's Appointments */}
        <section className="bg-white p-6 rounded-xl shadow mb-6 text-white-900 dark:bg-slate-700 dark:text-rose-200">
          <h3 className="text-lg font-semibold mb-2">Today's Appointments</h3>
          <ul className="space-y-3">
            <li className="p-3 border rounded-lg flex justify-between">
              <span>Ravi Kumar - Fever</span>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg">Consult</button>
            </li>
            <li className="p-3 border rounded-lg flex justify-between">
              <span>Priya Sharma - Diabetes</span>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg">Consult</button>
            </li>
          </ul>
        </section>

        {/* Patient Records */}
        <section className="bg-white p-6 rounded-xl shadow dark:bg-slate-700 dark:text-rose-200">
          <h3 className="text-lg font-semibold mb-2">Patient Records</h3>
          <p className="text-gray-600">Search and update patient records.</p>
        </section>
      </main>
    </div>
  );
}
