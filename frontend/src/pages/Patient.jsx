import { useEffect, useState } from "react";
import PatientSidebar from "../components/PatientSidebar";
import patientService from '../sevices/patientService';
import Appointments from "../components/Appointments";
import HealthProfile from "../components/HealthProfile";
import HealthTracking from "../components/HealthTracking";
import MedicineFinder from "../components/MedicineFinder";
import HospitalFinder from "../components/HospitalFinder";
import EmergencySOS from "../components/EmergencySOS";
import HealthRecords from "../components/HealthRecords";
import PatientDashboard from "../components/PatientDashboard";

export default function PatientPage({ user }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <PatientDashboard />;
      case 'medicines':
        return <MedicineFinder />;
      case 'hospitals':
        return <HospitalFinder />;
      case 'emergency':
        return <EmergencySOS />;
      case 'health-records':
        return <HealthRecords />;
      case 'appointments':
        return <Appointments />;
      case 'profile':
        return <HealthProfile />;
      case 'vitals':
        return <HealthTracking />;
      default:
        return <PatientDashboard />;
    }
  };

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      {user && user.role === 'patient' && <PatientSidebar activeTab={activeTab} setActiveTab={setActiveTab} />}
      <main className="flex-1 p-6">
        {renderContent()}
      </main>
    </div>
  );
}