import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
    Search,
    MapPin,
    Phone,
    Clock,
    Star,
    Navigation,
    Bed,
    Ambulance,
    Heart,
    Stethoscope
} from 'lucide-react';
// import ApiService from '../services/api.js';

export default function HospitalFinder() {
    const [searchQuery, setSearchQuery] = useState('');
    const [hospitals, setHospitals] = useState([]);
    const [emergencyHospitals, setEmergencyHospitals] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [location, setLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingEmergency, setIsLoadingEmergency] = useState(false);
    const [activeTab, setActiveTab] = useState('search');

    useEffect(() => {
        loadSpecialties();
        getCurrentLocation();
    }, []);

    const loadSpecialties = async () => {
        try {
            const response = await apiService.hospital.getSpecialties();
            setSpecialties(response.specialties || []);
        } catch (error) {
            console.error('Error loading specialties:', error);
        }
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    console.warn('Location access denied:', error);
                }
            );
        }
    };

    const searchHospitals = async () => {
        if (!searchQuery.trim() && !selectedSpecialty) return;

        setIsLoading(true);
        try {
            const params = {};
            if (searchQuery.trim()) params.query = searchQuery;
            if (selectedSpecialty) params.specialty = selectedSpecialty;

            const response = await apiService.hospital.search(params);
            setHospitals(response.hospitals || []);
            setSelectedHospital(null);
        } catch (error) {
            console.error('Hospital search error:', error);
            setHospitals([]);
        } finally {
            setIsLoading(false);
        }
    };

    const findNearbyHospitals = async () => {
        if (!location) {
            alert('Location access is required to find nearby hospitals');
            return;
        }

        setIsLoading(true);
        try {
            const params = {
                latitude: location.latitude,
                longitude: location.longitude,
                radius: 15 // 15km radius
            };
            if (selectedSpecialty) params.specialty = selectedSpecialty;

            const response = await apiService.hospital.findNearby(params);
            setHospitals(response.hospitals || []);
            setSelectedHospital(null);
        } catch (error) {
            console.error('Nearby hospitals error:', error);
            setHospitals([]);
        } finally {
            setIsLoading(false);
        }
    };

    const findEmergencyHospitals = async () => {
        setIsLoadingEmergency(true);
        try {
            const params = {};
            if (location) {
                params.latitude = location.latitude;
                params.longitude = location.longitude;
            }

            const response = await apiService.hospital.getEmergency(params);
            setEmergencyHospitals(response.hospitals || []);
        } catch (error) {
            console.error('Emergency hospitals error:', error);
            setEmergencyHospitals([]);
        } finally {
            setIsLoadingEmergency(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'emergency') {
            findEmergencyHospitals();
        }
    }, [activeTab, location]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            searchHospitals();
        }
    };

    const openDirections = (hospital) => {
        if (hospital.address && hospital.address.coordinates) {
            const lat = hospital.address.coordinates.latitude;
            const lng = hospital.address.coordinates.longitude;
            const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
            window.open(url, '_blank');
        }
    };

    const callHospital = (phoneNumber) => {
        window.open(`tel:${phoneNumber}`, '_self');
    };

    const HospitalCard = ({ hospital, showDistance = false }) => (
        <Card
            className={`cursor-pointer transition-all hover:shadow-md ${selectedHospital?._id === hospital._id ? 'ring-2 ring-blue-500' : ''
                }`}
            onClick={() => setSelectedHospital(hospital)}
        >
            <CardContent className="p-4">
                <div className="space-y-3">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg">{hospital.name}</h3>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {hospital.address.street}, {hospital.address.city}
                            </p>
                        </div>
                        {showDistance && hospital.distance && (
                            <Badge variant="outline" className="ml-2">
                                {hospital.distance}
                            </Badge>
                        )}
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                        {hospital.ratings && (
                            <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span>{hospital.ratings.average}</span>
                                <span className="text-gray-500">({hospital.ratings.count})</span>
                            </div>
                        )}
                        {hospital.type && (
                            <Badge variant="secondary" className="text-xs">
                                {hospital.type}
                            </Badge>
                        )}
                    </div>

                    {hospital.specialties && hospital.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {hospital.specialties.slice(0, 3).map((specialty, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                    {specialty}
                                </Badge>
                            ))}
                            {hospital.specialties.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                    +{hospital.specialties.length - 3} more
                                </Badge>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        {hospital.bedCapacity && (
                            <div className="flex items-center gap-1">
                                <Bed className="h-3 w-3" />
                                <span>{hospital.bedCapacity.total} beds</span>
                            </div>
                        )}
                        {hospital.emergencyServices?.ambulance && (
                            <div className="flex items-center gap-1 text-red-600">
                                <Ambulance className="h-3 w-3" />
                                <span>Emergency</span>
                            </div>
                        )}
                        {hospital.operatingHours?.emergency24x7 && (
                            <div className="flex items-center gap-1 text-green-600">
                                <Clock className="h-3 w-3" />
                                <span>24/7</span>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        {hospital.contact.phone && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    callHospital(hospital.contact.phone);
                                }}
                            >
                                <Phone className="h-3 w-3 mr-1" />
                                Call
                            </Button>
                        )}
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                                e.stopPropagation();
                                openDirections(hospital);
                            }}
                        >
                            <Navigation className="h-3 w-3 mr-1" />
                            Directions
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Stethoscope className="h-5 w-5 text-blue-600" />
                        Hospital Finder
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="search">Search Hospitals</TabsTrigger>
                            <TabsTrigger value="emergency" className="text-red-600">
                                <Heart className="h-4 w-4 mr-2" />
                                Emergency
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="search" className="space-y-4 mt-4">
                            {/* Search Controls */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Input
                                    placeholder="Search by hospital name, location..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="md:col-span-2"
                                />
                                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Specialty (optional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All Specialties</SelectItem>
                                        {specialties.map((specialty) => (
                                            <SelectItem key={specialty} value={specialty}>
                                                {specialty}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex gap-2">
                                <Button onClick={searchHospitals} disabled={isLoading}>
                                    <Search className="h-4 w-4 mr-2" />
                                    {isLoading ? 'Searching...' : 'Search'}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={findNearbyHospitals}
                                    disabled={isLoading || !location}
                                >
                                    <MapPin className="h-4 w-4 mr-2" />
                                    Find Nearby
                                </Button>
                            </div>

                            {!location && (
                                <Alert>
                                    <MapPin className="h-4 w-4" />
                                    <AlertDescription>
                                        Allow location access to find hospitals near you.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </TabsContent>

                        <TabsContent value="emergency" className="space-y-4 mt-4">
                            <Alert className="border-red-200 bg-red-50">
                                <Heart className="h-4 w-4 text-red-600" />
                                <AlertDescription className="text-red-800">
                                    <strong>Emergency Hospitals</strong> - Available 24/7 with ambulance services.
                                    For life-threatening emergencies, call emergency services immediately.
                                </AlertDescription>
                            </Alert>

                            <Button
                                onClick={findEmergencyHospitals}
                                disabled={isLoadingEmergency}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                <Ambulance className="h-4 w-4 mr-2" />
                                {isLoadingEmergency ? 'Finding...' : 'Find Emergency Hospitals'}
                            </Button>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Search Results */}
            {(hospitals.length > 0 || emergencyHospitals.length > 0) && (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {activeTab === 'emergency' ? 'Emergency Hospitals' : 'Search Results'}
                            ({activeTab === 'emergency' ? emergencyHospitals.length : hospitals.length} found)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(activeTab === 'emergency' ? emergencyHospitals : hospitals).map((hospital) => (
                                <HospitalCard
                                    key={hospital._id}
                                    hospital={hospital}
                                    showDistance={true}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Selected Hospital Details */}
            {selectedHospital && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Hospital Details
                            <div className="flex gap-2">
                                {selectedHospital.contact.phone && (
                                    <Button onClick={() => callHospital(selectedHospital.contact.phone)}>
                                        <Phone className="h-4 w-4 mr-2" />
                                        Call Hospital
                                    </Button>
                                )}
                                <Button variant="outline" onClick={() => openDirections(selectedHospital)}>
                                    <Navigation className="h-4 w-4 mr-2" />
                                    Get Directions
                                </Button>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-xl">{selectedHospital.name}</h3>
                            <p className="text-gray-600">{selectedHospital.address.street}</p>
                            <p className="text-gray-600">{selectedHospital.address.city}, {selectedHospital.address.state} {selectedHospital.address.zipCode}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <h4 className="font-medium">Contact Information</h4>
                                {selectedHospital.contact.phone && (
                                    <p className="text-sm">Phone: {selectedHospital.contact.phone}</p>
                                )}
                                {selectedHospital.contact.email && (
                                    <p className="text-sm">Email: {selectedHospital.contact.email}</p>
                                )}
                                {selectedHospital.contact.emergencyNumber && (
                                    <p className="text-sm text-red-600">Emergency: {selectedHospital.contact.emergencyNumber}</p>
                                )}
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-medium">Facilities</h4>
                                {selectedHospital.bedCapacity && (
                                    <p className="text-sm">Total Beds: {selectedHospital.bedCapacity.total}</p>
                                )}
                                {selectedHospital.emergencyServices && (
                                    <div className="space-y-1">
                                        {selectedHospital.emergencyServices.ambulance && (
                                            <Badge variant="destructive" className="mr-2">Ambulance Available</Badge>
                                        )}
                                        {selectedHospital.operatingHours?.emergency24x7 && (
                                            <Badge variant="secondary">24/7 Emergency</Badge>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {selectedHospital.specialties && selectedHospital.specialties.length > 0 && (
                            <div>
                                <h4 className="font-medium mb-2">Medical Specialties</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedHospital.specialties.map((specialty, idx) => (
                                        <Badge key={idx} variant="outline">
                                            {specialty}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedHospital.description && (
                            <div>
                                <h4 className="font-medium mb-2">About</h4>
                                <p className="text-sm text-gray-600">{selectedHospital.description}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}