import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/text-area';
import {
    AlertTriangle,
    Phone,
    MapPin,
    Heart,
    Clock,
    Ambulance,
    Navigation,
    Shield
} from 'lucide-react';
import api from '../sevices/api';

export default function EmergencySOS() {
    const [location, setLocation] = useState(null);
    const [isTriggering, setIsTriggering] = useState(false);
    const [emergencyActive, setEmergencyActive] = useState(null);
    const [emergencyType, setEmergencyType] = useState('');
    const [severity, setSeverity] = useState('');
    const [description, setDescription] = useState('');
    const [vitals, setVitals] = useState({
        heartRate: '',
        bloodPressure: '',
        consciousness: 'conscious'
    });

    const emergencyTypes = [
        'Heart Attack',
        'Stroke',
        'Severe Injury',
        'Breathing Difficulty',
        'Severe Allergic Reaction',
        'Poisoning',
        'Severe Bleeding',
        'Loss of Consciousness',
        'Severe Pain',
        'Other Medical Emergency'
    ];

    const severityLevels = [
        { value: 'critical', label: 'Critical - Life Threatening', color: 'bg-red-600' },
        { value: 'high', label: 'High - Urgent Care Needed', color: 'bg-orange-500' },
        { value: 'medium', label: 'Medium - Medical Attention Required', color: 'bg-yellow-500' }
    ];

    useEffect(() => {
        // Request location permission when the component mounts
        requestLocationPermission();
    }, []);

    const requestLocationPermission = async () => {
        if (navigator.geolocation) {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 300000
                    });
                });
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                });
            } catch (error) {
                console.warn('Location access denied:', error);
                // Handle the case where the user denies permission
                if (error.code === error.PERMISSION_DENIED) {
                    alert('Location permission is required for emergency services. Please enable it in your browser settings.');
                }
            }
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    const getCurrentLocation = () => {
        requestLocationPermission();
    };

    const triggerEmergency = async () => {
        if (!emergencyType || !severity || !description) {
            alert('Please fill in all required fields');
            return;
        }

        if (!location) {
            alert('Location is required for emergency services. Please allow location access.');
            getCurrentLocation();
            return;
        }

        setIsTriggering(true);

        try {
            const emergencyData = {
                emergencyType,
                severity,
                description,
                location: {
                    type: 'Point',
                    coordinates: [location.longitude, location.latitude], // GeoJSON format [lng, lat]
                    address: 'Current Location', // Could be enhanced with reverse geocoding
                    accuracy: location.accuracy
                },
                vitals: {
                    ...vitals,
                    timestamp: new Date().toISOString()
                }
            };

            const response = await api.triggerSOS(emergencyData);

            setEmergencyActive(response.emergency);

            // Show success with instructions
            alert(`Emergency SOS triggered successfully!\n\nEmergency ID: ${response.emergency.id}\n\nNext steps:\n${response.instructions.join('\n')}`);

        } catch (error) {
            console.error('Emergency SOS error:', error);
            alert('Failed to trigger emergency SOS. Please call emergency services directly: 911');
        } finally {
            setIsTriggering(false);
        }
    };

    const callEmergencyServices = () => {
        window.open('tel:911', '_self');
    };

    const quickEmergency = async (type, severityLevel) => {
        if (!location) {
            getCurrentLocation();
            return;
        }

        setEmergencyType(type);
        setSeverity(severityLevel);
        setDescription(`Quick emergency: ${type}`);
    };

    return (
        <div className="space-y-6">
            {/* Emergency Alert */}
            <Alert className="border-red-500 bg-red-50">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <AlertDescription className="text-red-800">
                    <strong>Emergency Services</strong> - For immediate life-threatening emergencies, call 911 directly.
                    This system will notify emergency contacts and nearby hospitals.
                </AlertDescription>
            </Alert>

            {/* Quick Emergency Buttons */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                        <Shield className="h-5 w-5" />
                        Quick Emergency Actions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button
                            size="lg"
                            className="bg-red-600 hover:bg-red-700 h-16"
                            onClick={callEmergencyServices}
                        >
                            <Phone className="h-6 w-6 mr-2" />
                            Call 911 Now
                        </Button>

                        <Button
                            size="lg"
                            variant="outline"
                            className="border-red-500 text-red-600 hover:bg-red-50 h-16"
                            onClick={() => quickEmergency('Heart Attack', 'critical')}
                            disabled={isTriggering}
                        >
                            <Heart className="h-6 w-6 mr-2" />
                            Heart Emergency
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                        <Button
                            variant="outline"
                            className="border-orange-500 text-orange-600 hover:bg-orange-50"
                            onClick={() => quickEmergency('Stroke', 'critical')}
                            disabled={isTriggering}
                        >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Stroke
                        </Button>

                        <Button
                            variant="outline"
                            className="border-orange-500 text-orange-600 hover:bg-orange-50"
                            onClick={() => quickEmergency('Severe Injury', 'high')}
                            disabled={isTriggering}
                        >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Severe Injury
                        </Button>

                        <Button
                            variant="outline"
                            className="border-orange-500 text-orange-600 hover:bg-orange-50"
                            onClick={() => quickEmergency('Breathing Difficulty', 'critical')}
                            disabled={isTriggering}
                        >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Can't Breathe
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Emergency Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Detailed Emergency Report</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Emergency Type *</label>
                            <Select value={emergencyType} onValueChange={setEmergencyType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select emergency type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {emergencyTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium">Severity Level *</label>
                            <Select value={severity} onValueChange={setSeverity}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select severity" />
                                </SelectTrigger>
                                <SelectContent>
                                    {severityLevels.map((level) => (
                                        <SelectItem key={level.value} value={level.value}>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full ${level.color}`}></div>
                                                {level.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Description *</label>
                        <Textarea
                            placeholder="Describe the emergency situation, symptoms, what happened..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>

                    {/* Vitals Section */}
                    <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-3">Vital Signs (if available)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm">Heart Rate (BPM)</label>
                                <input
                                    type="number"
                                    placeholder="80"
                                    value={vitals.heartRate}
                                    onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                                />
                            </div>

                            <div>
                                <label className="text-sm">Blood Pressure</label>
                                <input
                                    type="text"
                                    placeholder="120/80"
                                    value={vitals.bloodPressure}
                                    onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                                />
                            </div>

                            <div>
                                <label className="text-sm">Consciousness Level</label>
                                <Select
                                    value={vitals.consciousness}
                                    onValueChange={(value) => setVitals({ ...vitals, consciousness: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="conscious">Conscious & Alert</SelectItem>
                                        <SelectItem value="drowsy">Drowsy</SelectItem>
                                        <SelectItem value="unconscious">Unconscious</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Location Status */}
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        {location ? (
                            <span className="text-green-600">Location detected (accuracy: {Math.round(location.accuracy)}m)</span>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="text-red-600">Location access required for emergency services</span>
                                <Button onClick={getCurrentLocation} size="sm" variant="outline">
                                    <Navigation className="h-4 w-4 mr-2" />
                                    Get Location
                                </Button>
                            </div>
                        )}
                    </div>

                    <Button
                        onClick={triggerEmergency}
                        disabled={isTriggering || !location}
                        className="w-full bg-red-600 hover:bg-red-700"
                        size="lg"
                    >
                        {isTriggering ? (
                            <>
                                <Clock className="h-4 w-4 mr-2 animate-spin" />
                                Triggering Emergency SOS...
                            </>
                        ) : (
                            <>
                                <Ambulance className="h-4 w-4 mr-2" />
                                Trigger Emergency SOS
                            </>
                        )}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                        Emergency contacts and nearby hospitals will be notified immediately
                    </p>
                </CardContent>
            </Card>

            {/* Active Emergency Status */}
            {emergencyActive && (
                <Card className="border-red-500">
                    <CardHeader className="bg-red-50">
                        <CardTitle className="text-red-600 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Emergency Active - ID: {emergencyActive.id}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm"><strong>Type:</strong> {emergencyActive.emergencyType}</p>
                                <p className="text-sm"><strong>Severity:</strong>
                                    <Badge variant="destructive" className="ml-2">
                                        {emergencyActive.severity.toUpperCase()}
                                    </Badge>
                                </p>
                                <p className="text-sm"><strong>Time:</strong> {new Date(emergencyActive.createdAt).toLocaleString()}</p>
                            </div>

                            <div>
                                <p className="text-sm"><strong>Status:</strong>
                                    <Badge variant="secondary" className="ml-2">
                                        {emergencyActive.status.toUpperCase()}
                                    </Badge>
                                </p>
                                <p className="text-sm"><strong>Location:</strong> Sent to responders</p>
                            </div>
                        </div>

                        <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                                Emergency services have been notified. Stay calm, stay in a safe location, and wait for help to arrive.
                                Keep this emergency ID for reference: <strong>{emergencyActive.id}</strong>
                            </AlertDescription>
                        </Alert>

                        <div className="flex gap-2">
                            <Button onClick={callEmergencyServices} className="bg-red-600 hover:bg-red-700">
                                <Phone className="h-4 w-4 mr-2" />
                                Call 911 Again
                            </Button>
                            <Button variant="outline" onClick={() => setEmergencyActive(null)}>
                                Close Status
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
