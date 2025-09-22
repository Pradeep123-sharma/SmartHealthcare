import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Search, Pill, AlertTriangle, MapPin, Clock, Star } from 'lucide-react';
// import ApiService from '../services/api.js';

export default function MedicineFinder() {
    const [searchQuery, setSearchQuery] = useState('');
    const [medicines, setMedicines] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [alternatives, setAlternatives] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingAlternatives, setIsLoadingAlternatives] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await apiService.medicine.getCategories();
            setCategories(response.categories || []);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const searchMedicines = async () => {
        if (!searchQuery.trim() && !selectedCategory) return;

        setIsLoading(true);
        try {
            const params = {};
            if (searchQuery.trim()) params.query = searchQuery;
            if (selectedCategory) params.category = selectedCategory;

            const response = await apiService.medicine.search(params);
            setMedicines(response.medicines || []);
            setSelectedMedicine(null);
            setAlternatives([]);
        } catch (error) {
            console.error('Medicine search error:', error);
            setMedicines([]);
        } finally {
            setIsLoading(false);
        }
    };

    const loadAlternatives = async (medicineId) => {
        setIsLoadingAlternatives(true);
        try {
            const response = await apiService.medicine.getAlternatives(medicineId);
            setAlternatives(response.alternatives || []);
        } catch (error) {
            console.error('Error loading alternatives:', error);
            setAlternatives([]);
        } finally {
            setIsLoadingAlternatives(false);
        }
    };

    const handleMedicineSelect = async (medicine) => {
        setSelectedMedicine(medicine);
        await loadAlternatives(medicine._id);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            searchMedicines();
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Pill className="h-5 w-5 text-green-600" />
                        Medicine Finder
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Search Controls */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                placeholder="Search medicines by name, ingredient..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="md:col-span-2"
                            />
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Category (optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Categories</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button onClick={searchMedicines} disabled={isLoading} className="w-full md:w-auto">
                            <Search className="h-4 w-4 mr-2" />
                            {isLoading ? 'Searching...' : 'Search Medicines'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Search Results */}
            {medicines.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Search Results ({medicines.length} found)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {medicines.map((medicine) => (
                                <Card
                                    key={medicine._id}
                                    className={`cursor-pointer transition-all hover:shadow-md ${selectedMedicine?._id === medicine._id ? 'ring-2 ring-blue-500' : ''
                                        }`}
                                    onClick={() => handleMedicineSelect(medicine)}
                                >
                                    <CardContent className="p-4">
                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-lg">{medicine.name}</h3>
                                            <p className="text-sm text-gray-600">{medicine.genericName}</p>
                                            <p className="text-sm text-gray-500">by {medicine.manufacturer}</p>

                                            <div className="flex items-center gap-2">
                                                <Badge variant={medicine.prescriptionRequired ? 'destructive' : 'secondary'}>
                                                    {medicine.prescriptionRequired ? 'Prescription Required' : 'OTC'}
                                                </Badge>
                                                {medicine.ratings && (
                                                    <div className="flex items-center gap-1">
                                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                        <span className="text-xs">{medicine.ratings.average}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {medicine.category && (
                                                <Badge variant="outline" className="text-xs">
                                                    {medicine.category}
                                                </Badge>
                                            )}

                                            {medicine.dosageForms && (
                                                <p className="text-xs text-gray-500">
                                                    Available in: {medicine.dosageForms.join(', ')}
                                                </p>
                                            )}

                                            {/* Show nearby availability if available */}
                                            {medicine.nearbyAvailability && medicine.nearbyAvailability.length > 0 && (
                                                <div className="mt-2">
                                                    <p className="text-xs font-medium text-green-600 flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" />
                                                        Available nearby
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {medicine.nearbyAvailability[0].pharmacy} - ₹{medicine.nearbyAvailability[0].price}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Selected Medicine Details & Alternatives */}
            {selectedMedicine && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Medicine Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Medicine Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-xl">{selectedMedicine.name}</h3>
                                <p className="text-gray-600">{selectedMedicine.genericName}</p>
                                <p className="text-sm text-gray-500">Manufactured by {selectedMedicine.manufacturer}</p>
                            </div>

                            {selectedMedicine.activeIngredients && (
                                <div>
                                    <h4 className="font-medium">Active Ingredients</h4>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {selectedMedicine.activeIngredients.map((ingredient, idx) => (
                                            <Badge key={idx} variant="outline" className="text-xs">
                                                {ingredient}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedMedicine.uses && (
                                <div>
                                    <h4 className="font-medium">Uses</h4>
                                    <ul className="text-sm text-gray-600 mt-1 space-y-1">
                                        {selectedMedicine.uses.map((use, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span className="w-1 h-1 bg-gray-400 rounded-full mt-2"></span>
                                                {use}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {selectedMedicine.sideEffects && (
                                <div>
                                    <h4 className="font-medium flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                                        Side Effects
                                    </h4>
                                    <ul className="text-sm text-gray-600 mt-1 space-y-1">
                                        {selectedMedicine.sideEffects.slice(0, 5).map((effect, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span className="w-1 h-1 bg-orange-400 rounded-full mt-2"></span>
                                                {effect}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <Alert>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                    Always consult with a healthcare professional before starting any medication. This information is for educational purposes only.
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>

                    {/* Alternatives */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Alternative Medicines</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoadingAlternatives ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                                </div>
                            ) : alternatives.length > 0 ? (
                                <div className="space-y-3">
                                    {alternatives.map((alt) => (
                                        <Card key={alt.id} className="cursor-pointer hover:shadow-sm transition-shadow">
                                            <CardContent className="p-3">
                                                <div className="space-y-2">
                                                    <h4 className="font-medium">{alt.name}</h4>
                                                    <p className="text-sm text-gray-600">{alt.genericName}</p>
                                                    <p className="text-xs text-gray-500">by {alt.manufacturer}</p>

                                                    <div className="flex items-center gap-2">
                                                        <Badge variant={alt.prescriptionRequired ? 'destructive' : 'secondary'} className="text-xs">
                                                            {alt.prescriptionRequired ? 'Rx' : 'OTC'}
                                                        </Badge>
                                                        {alt.ratings && (
                                                            <div className="flex items-center gap-1">
                                                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                                <span className="text-xs">{alt.ratings.average}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {alt.dosageForms && (
                                                        <p className="text-xs text-gray-500">
                                                            {alt.dosageForms.join(', ')}
                                                        </p>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">
                                    No alternatives found for this medicine.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}