import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
    FileText,
    Upload,
    Download,
    Eye,
    Search,
    Calendar,
    File,
    Image,
    FileArchive,
    Trash2
} from 'lucide-react';
import patientService from '../sevices/patientService';
import api from '../sevices/api';

export default function HealthRecords() {
    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const categories = [
        { id: 'all', name: 'All Records', icon: FileText },
        { id: 'lab-results', name: 'Lab Results', icon: FileText },
        { id: 'prescriptions', name: 'Prescriptions', icon: File },
        { id: 'medical-images', name: 'Medical Images', icon: Image },
        { id: 'doctor-notes', name: 'Doctor Notes', icon: FileText },
        { id: 'vaccination', name: 'Vaccination Records', icon: FileText },
        { id: 'insurance', name: 'Insurance Documents', icon: FileArchive }
    ];

    // Demo data since backend might not be available
    const demoRecords = [
        {
            id: '1',
            name: 'Blood Test Results - Complete Panel',
            category: 'lab-results',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            size: '245 KB',
            type: 'PDF',
            doctor: 'Dr. Sarah Smith',
            description: 'Complete blood count, lipid profile, and liver function tests'
        },
        {
            id: '2',
            name: 'Chest X-Ray',
            category: 'medical-images',
            date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            size: '1.2 MB',
            type: 'DICOM',
            doctor: 'Dr. Michael Chen',
            description: 'Chest X-ray for routine checkup'
        },
        {
            id: '3',
            name: 'Prescription - Antibiotics',
            category: 'prescriptions',
            date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
            size: '89 KB',
            type: 'PDF',
            doctor: 'Dr. Emily Johnson',
            description: 'Amoxicillin 500mg - 7 day course'
        },
        {
            id: '4',
            name: 'Annual Physical Exam Notes',
            category: 'doctor-notes',
            date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            size: '156 KB',
            type: 'PDF',
            doctor: 'Dr. Sarah Smith',
            description: 'Comprehensive annual physical examination'
        },
        {
            id: '5',
            name: 'COVID-19 Vaccination Certificate',
            category: 'vaccination',
            date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
            size: '78 KB',
            type: 'PDF',
            doctor: 'City Health Department',
            description: 'Pfizer-BioNTech COVID-19 vaccine - 2nd dose'
        }
    ];

    useEffect(() => {
        loadHealthRecords();
    }, []);

    useEffect(() => {
        filterRecords();
    }, [records, searchQuery, selectedCategory]);

    const loadHealthRecords = async () => {
        setIsLoading(true);
        try {
            const user = api.getCurrentUser();
            if (!user || !user.id) {
                setRecords(demoRecords);
                setIsLoading(false);
                return;
            }
            // Try to load from backend, fallback to demo data
            const response = await patientService.getHealthRecords(user.id);
            setRecords(response?.records || demoRecords);
        } catch (error) {
            console.error('Health records error:', error);
            // Use demo data if backend is not available
            setRecords(demoRecords);
        } finally {
            setIsLoading(false);
        }
    };

    const filterRecords = () => {
        let filtered = records;

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(record => record.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(record =>
                record.name.toLowerCase().includes(query) ||
                record.description.toLowerCase().includes(query) ||
                record.doctor.toLowerCase().includes(query)
            );
        }

        setFilteredRecords(filtered);
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            // In a real app, this would upload to the backend
            setTimeout(() => {
                clearInterval(progressInterval);
                setUploadProgress(100);

                // Add new record to demo data
                const newRecord = {
                    id: Date.now().toString(),
                    name: file.name,
                    category: 'lab-results', // Default category
                    date: new Date(),
                    size: `${Math.round(file.size / 1024)} KB`,
                    type: file.type.split('/')[1]?.toUpperCase() || 'FILE',
                    doctor: 'Uploaded by Patient',
                    description: 'Patient uploaded document'
                };

                setRecords(prev => [newRecord, ...prev]);
                setIsUploading(false);
                setUploadProgress(0);
            }, 2000);

        } catch (error) {
            console.error('Upload error:', error);
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const getFileIcon = (type) => {
        switch (type.toLowerCase()) {
            case 'pdf': return <FileText className="h-5 w-5 text-red-600" />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'dicom': return <Image className="h-5 w-5 text-blue-600" />;
            default: return <File className="h-5 w-5 text-gray-600" />;
        }
    };

    const getCategoryCount = (categoryId) => {
        if (categoryId === 'all') return records.length;
        return records.filter(record => record.category === categoryId).length;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Upload Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5 text-blue-600" />
                        Upload Health Records
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600 mb-4">
                            Upload your medical documents, test results, and reports
                        </p>
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                        />
                        <Button
                            onClick={() => document.getElementById('file-upload').click()}
                            disabled={isUploading}
                        >
                            {isUploading ? 'Uploading...' : 'Choose File'}
                        </Button>
                        {isUploading && (
                            <div className="mt-4">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{uploadProgress}% uploaded</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Categories and Search */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Categories Sidebar */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {categories.map((category) => {
                                const Icon = category.icon;
                                const count = getCategoryCount(category.id);
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${selectedCategory === category.id
                                                ? 'bg-green-50 text-green-600 border border-green-200'
                                                : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icon className="h-4 w-4" />
                                            <span className="text-sm">{category.name}</span>
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                            {count}
                                        </Badge>
                                    </button>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Records List */}
                <div className="lg:col-span-3 space-y-4">
                    {/* Search */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="relative">
                                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <Input
                                    placeholder="Search records by name, doctor, or description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Records */}
                    {filteredRecords.length > 0 ? (
                        <div className="space-y-3">
                            {filteredRecords.map((record) => (
                                <Card key={record.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 flex-1">
                                                {getFileIcon(record.type)}
                                                <div className="flex-1">
                                                    <h3 className="font-medium">{record.name}</h3>
                                                    <p className="text-sm text-gray-600">{record.description}</p>
                                                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {record.date.toLocaleDateString()}
                                                        </span>
                                                        <span>by {record.doctor}</span>
                                                        <span>{record.size}</span>
                                                        <Badge variant="outline" className="text-xs">
                                                            {record.type}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button size="sm" variant="outline">
                                                    <Eye className="h-3 w-3 mr-1" />
                                                    View
                                                </Button>
                                                <Button size="sm" variant="outline">
                                                    <Download className="h-3 w-3 mr-1" />
                                                    Download
                                                </Button>
                                                <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                <h3 className="font-medium text-gray-900 mb-2">No records found</h3>
                                <p className="text-gray-500">
                                    {searchQuery || selectedCategory !== 'all'
                                        ? 'Try adjusting your search or filter criteria'
                                        : 'Upload your first health record to get started'
                                    }
                                </p>
                                {!searchQuery && selectedCategory === 'all' && (
                                    <Button
                                        className="mt-4"
                                        onClick={() => document.getElementById('file-upload').click()}
                                    >
                                        <Upload className="h-4 w-4 mr-2" />
                                        Upload First Record
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}