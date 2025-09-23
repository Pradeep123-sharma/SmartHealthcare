import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import PatientDashboard from '../components/PatientDashboard';
// Import other components you might need for other tabs
// import MedicineFinder from '../components/MedicineFinder'; 
// import HospitalFinder from '../components/HospitalFinder';

const PatientPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <PatientDashboard />;
      // Add cases for other tabs from your Sidebar as you build them
      // case 'medicines':
      //   return <MedicineFinder />;
      // case 'hospitals':
      //   return <HospitalFinder />;
      default:
        return <PatientDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-6 lg:p-8">{renderContent()}</main>
    </div>
  );
};

export default PatientPage;