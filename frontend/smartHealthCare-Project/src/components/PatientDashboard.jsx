import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import {
    Heart,
    Calendar,
    FileText,
    Activity,
    Bell,
    TrendingUp,
    Clock,
    Phone,
    MapPin,
    Pill
} from 'lucide-react';
import patientService from '../sevices/patientService.js';

export default function PatientDashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [healthSummary, setHealthSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setIsLoading(true);
        try {
            const [dashboardResponse, healthResponse] = await Promise.all([
                patientService.getPatientDashboard(),
                patientService.getHealthSummary(),
            ]);

            setDashboardData(dashboardResponse);
            setHealthSummary(healthResponse.healthSummary);
        } catch (error) {
            console.error('Dashboard error:', error);
            // Show demo data if backend is not available
            setDashboardData({
                patient: {
                    name: 'John Doe',
                    age: 35,
                    bloodGroup: 'O+',
                    bmi: 24.5
                },
                healthMetrics: {
                    totalAppointments: 12,
                    upcomingAppointments: 2,
                    totalHealthRecords: 8,
                    lastCheckup: { appointmentDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
                },
                reminders: [
                    {
                        type: 'appointment',
                        message: 'Upcoming appointment with Dr. Smith',
                        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                        priority: 'high'
                    },
                    {
                        type: 'medication',
                        message: 'Time for your vitamin D supplement',
                        priority: 'medium'
                    }
                ]
            });
            setHealthSummary({
                personalInfo: {
                    name: 'John Doe',
                    age: 35,
                    gender: 'Male',
                    bloodGroup: 'O+',
                    height: '175 cm',
                    weight: '75 kg',
                    bmi: 24.5
                },
                allergies: ['Peanuts', 'Shellfish'],
                chronicConditions: [],
                currentMedications: [
                    { name: 'Vitamin D', dosage: '1000 IU daily' }
                ]
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 dark:border-green-400"></div>
            </div>
        );
    }

    const getHealthStatus = () => {
        if (!healthSummary?.personalInfo?.bmi) return { status: 'Unknown', color: 'gray' };

        const bmi = healthSummary.personalInfo.bmi;
        if (bmi < 18.5) return { status: 'Underweight', color: 'blue' };
        if (bmi < 25) return { status: 'Normal', color: 'green' };
        if (bmi < 30) return { status: 'Overweight', color: 'orange' };
        return { status: 'Obese', color: 'red' };
    };

    const healthStatus = getHealthStatus();

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white dark:from-green-700 dark:to-blue-800">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Welcome back, {dashboardData?.patient?.name || 'Patient'}!</h1>
                        <p className="opacity-90 mt-1">Here's your health overview for today</p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm opacity-90">Health Status</div>
                        <Badge className={
                            healthStatus.color === 'green' ? 'bg-green-500 text-white' :
                                healthStatus.color === 'orange' ? 'bg-orange-500 text-white' :
                                    healthStatus.color === 'red' ? 'bg-red-500 text-white' :
                                        healthStatus.color === 'blue' ? 'bg-blue-500 text-white' :
                                            'bg-gray-500 text-white'
                        }>
                            {healthStatus.status}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
                                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming</p>
                                <p className="text-xl font-bold dark:text-white">{dashboardData?.healthMetrics?.upcomingAppointments || 0}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500">Appointments</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="dark:bg-gray-800 dark:border-gray-700">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900">
                                <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Health Records</p>
                                <p className="text-xl font-bold dark:text-white">{dashboardData?.healthMetrics?.totalHealthRecords || 0}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500">Documents</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="dark:bg-gray-800 dark:border-gray-700">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900">
                                <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">BMI</p>
                                <p className="text-xl font-bold dark:text-white">{healthSummary?.personalInfo?.bmi || '--'}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500">{healthStatus.status}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="dark:bg-gray-800 dark:border-gray-700">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg dark:bg-red-900">
                                <Heart className="h-5 w-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Blood Group</p>
                                <p className="text-xl font-bold dark:text-white">{healthSummary?.personalInfo?.bloodGroup || '--'}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500">Type</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Health Reminders */}
            {dashboardData?.reminders && dashboardData.reminders.length > 0 && (
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 dark:text-white">
                            <Bell className="h-5 w-5 text-orange-500" />
                            Health Reminders
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {dashboardData.reminders.map((reminder, index) => (
                                <Alert key={index} className={`border-l-4 ${reminder.priority === 'high' ? 'border-l-red-500 bg-red-50 dark:bg-red-900/20' :
                                        reminder.priority === 'medium' ? 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20' :
                                            'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    }`}>
                                    <AlertDescription className="flex items-center justify-between dark:text-gray-300">
                                        <div className="flex items-center gap-2">
                                            {reminder.type === 'appointment' ? <Calendar className="h-4 w-4" /> : <Pill className="h-4 w-4" />}
                                            <span>{reminder.message}</span>
                                        </div>
                                        {reminder.date && (
                                            <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-400">
                                                {new Date(reminder.date).toLocaleDateString()}
                                            </Badge>
                                        )}
                                    </AlertDescription>
                                </Alert>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Quick Actions */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                    <CardTitle className="dark:text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button variant="outline" className="h-20 flex flex-col gap-2 dark:border-gray-700 dark:hover:bg-gray-700">
                            <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm dark:text-white">Book Appointment</span>
                        </Button>

                        <Button variant="outline" className="h-20 flex flex-col gap-2 dark:border-gray-700 dark:hover:bg-gray-700">
                            <Pill className="h-6 w-6 text-green-600 dark:text-green-400" />
                            <span className="text-sm dark:text-white">Find Medicines</span>
                        </Button>

                        <Button variant="outline" className="h-20 flex flex-col gap-2 dark:border-gray-700 dark:hover:bg-gray-700">
                            <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            <span className="text-sm dark:text-white">Find Hospitals</span>
                        </Button>

                        <Button variant="outline" className="h-20 flex flex-col gap-2 border-red-500 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                            <Phone className="h-6 w-6" />
                            <span className="text-sm">Emergency SOS</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Appointments */}
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 dark:text-white">
                            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            Recent Appointments
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {dashboardData?.appointments?.recent && dashboardData.appointments.recent.length > 0 ? (
                            <div className="space-y-3">
                                {dashboardData.appointments.recent.slice(0, 3).map((appointment, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700">
                                        <div>
                                            <p className="font-medium dark:text-white">Dr. {appointment.doctor?.user?.firstName} {appointment.doctor?.user?.lastName}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.type || 'General Consultation'}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                                {new Date(appointment.appointmentDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <Badge variant={
                                            appointment.status === 'completed' ? 'secondary' :
                                                appointment.status === 'confirmed' ? 'default' : 'outline'
                                        }>
                                            {appointment.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>No recent appointments</p>
                                <Button variant="outline" size="sm" className="mt-2 dark:border-gray-600 dark:hover:bg-gray-700">
                                    Book Your First Appointment
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Health Summary */}
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 dark:text-white">
                            <Heart className="h-5 w-5 text-red-600 dark:text-red-400" />
                            Health Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400">Age</p>
                                    <p className="font-medium dark:text-white">{healthSummary?.personalInfo?.age || '--'} years</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400">Gender</p>
                                    <p className="font-medium dark:text-white">{healthSummary?.personalInfo?.gender || '--'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400">Height</p>
                                    <p className="font-medium dark:text-white">{healthSummary?.personalInfo?.height || '--'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400">Weight</p>
                                    <p className="font-medium dark:text-white">{healthSummary?.personalInfo?.weight || '--'}</p>
                                </div>
                            </div>

                            {healthSummary?.allergies && healthSummary.allergies.length > 0 && (
                                <div>
                                    <p className="text-gray-600 text-sm mb-2 dark:text-gray-400">Allergies</p>
                                    <div className="flex flex-wrap gap-1">
                                        {healthSummary.allergies.map((allergy, index) => (
                                            <Badge key={index} variant="destructive" className="text-xs">
                                                {allergy}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {healthSummary?.currentMedications && healthSummary.currentMedications.length > 0 && (
                                <div>
                                    <p className="text-gray-600 text-sm mb-2 dark:text-gray-400">Current Medications</p>
                                    <div className="space-y-1">
                                        {healthSummary.currentMedications.slice(0, 3).map((medication, index) => (
                                            <div key={index} className="text-sm dark:text-gray-300">
                                                <span className="font-medium dark:text-white">{medication.name}</span>
                                                {medication.dosage && <span className="text-gray-500"> - {medication.dosage}</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Button variant="outline" size="sm" className="w-full dark:border-gray-600 dark:hover:bg-gray-700">
                                <FileText className="h-4 w-4 mr-2" />
                                View Complete Health Profile
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}