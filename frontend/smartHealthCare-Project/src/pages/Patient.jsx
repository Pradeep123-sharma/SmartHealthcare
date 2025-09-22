import { useState } from 'react';
import Sidebar from "../components/Sidebar";
import PatientDashboard from "../components/PatientDashboard";
// import AIChat from "../components/AIChat";
import MedicineFinder from "../components/MedicineFinder";
import HospitalFinder from "../components/HospitalFinder";
import EmergencySOS from "../components/EmergencySOS";
import HealthRecords from "../components/HealthRecords";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Calendar, FileText, User, Activity } from "lucide-react";

export default function PatientPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <PatientDashboard />;
      /* case 'chat':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">AI Health Assistant</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Chat with our AI assistant for health guidance, symptom checking, and medical information.
            </p>
            <AIChat />
          </div>
        ); */
      case 'medicines':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Medicine Finder</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Search for medicines, find alternatives, and check drug interactions.
            </p>
            <MedicineFinder />
          </div>
        );
      case 'hospitals':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Hospital Finder</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Find nearby hospitals, emergency services, and specialized medical facilities.
            </p>
            <HospitalFinder />
          </div>
        );
      case 'emergency':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-red-600">🚨 Emergency SOS</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Emergency assistance and notification system. For immediate emergencies, call 911.
            </p>
            <EmergencySOS />
          </div>
        );
      case 'health-records':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Health Records Vault</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your secure digital health records vault. Store and access all your medical documents in one place.
            </p>
            <HealthRecords />
          </div>
        );
      case 'appointments':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Appointments</h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Appointment Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Book consultations with doctors, manage your appointments, and access telemedicine services.
                </p>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4 text-center">
                        <Calendar className="h-8 w-8 mx-auto mb-2 text-green-600" />
                        <h3 className="font-medium">Book New Appointment</h3>
                        <p className="text-sm text-gray-500 mt-1">Schedule with available doctors</p>
                      </CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4 text-center">
                        <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <h3 className="font-medium">Telemedicine</h3>
                        <p className="text-sm text-gray-500 mt-1">Virtual consultations</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'profile':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Health Profile</h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Health Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Manage your personal health information, medical history, and preferences.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Basic Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Age:</strong> 35 years</p>
                      <p><strong>Gender:</strong> Male</p>
                      <p><strong>Blood Group:</strong> O+</p>
                      <p><strong>Height:</strong> 175 cm</p>
                      <p><strong>Weight:</strong> 75 kg</p>
                      <p><strong>BMI:</strong> 24.5 (Normal)</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium">Medical History</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Allergies:</strong> Peanuts, Shellfish</p>
                      <p><strong>Chronic Conditions:</strong> None</p>
                      <p><strong>Current Medications:</strong> Vitamin D</p>
                      <p><strong>Emergency Contact:</strong> Jane Doe (Spouse)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'vitals':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Health Tracking</h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Vital Signs & Health Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Track your vital signs, symptoms, and health metrics over time.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {['Blood Pressure', 'Heart Rate', 'Weight', 'Blood Sugar', 'Temperature', 'Sleep', 'Steps', 'Mood'].map((vital) => (
                    <Card key={vital} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4 text-center">
                        <Activity className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                        <h3 className="font-medium text-sm">{vital}</h3>
                        <p className="text-lg font-bold">--</p>
                        <p className="text-xs text-gray-500">No data</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return <PatientDashboard />;
    }
  };

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-6 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}
