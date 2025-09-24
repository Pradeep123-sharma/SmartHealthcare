const Hospital = require('../models/Hospital');

const getAllHospitals = async () => {
    try {
        const hospitals = await Hospital.find();
        return hospitals;
    } catch (error) {
        throw new Error('Error fetching hospitals: ' + error.message);
    }
};

const getHospitalById = async (id) => {
    try {
        const hospital = await Hospital.findById(id);
        if (!hospital) {
            throw new Error('Hospital not found');
        }
        return hospital;
    } catch (error) {
        throw new Error('Error fetching hospital: ' + error.message);
    }
};

const createHospital = async (hospitalData) => {
    try {
        const newHospital = new Hospital(hospitalData);
        await newHospital.save();
        return newHospital;
    } catch (error) {
        throw new Error('Error creating hospital: ' + error.message);
    }
};

const updateHospital = async (id, hospitalData) => {
    try {
        const updatedHospital = await Hospital.findByIdAndUpdate(id, hospitalData, { new: true });
        if (!updatedHospital) {
            throw new Error('Hospital not found');
        }
        return updatedHospital;
    } catch (error) {
        throw new Error('Error updating hospital: ' + error.message);
    }
};

const deleteHospital = async (id) => {
    try {
        const deletedHospital = await Hospital.findByIdAndDelete(id);
        if (!deletedHospital) {
            throw new Error('Hospital not found');
        }
        return deletedHospital;
    } catch (error) {
        throw new Error('Error deleting hospital: ' + error.message);
    }
};

const getSpecialties = async () => {
    try {
        const specialties = await Hospital.distinct('specialties');
        return specialties;
    } catch (error) {
        throw new Error('Error fetching specialties: ' + error.message);
    }
};

const searchHospitals = async (queryParams) => {
    try {
        const { query, specialty } = queryParams;
        let filter = {};

        if (query) {
            filter.$or = [
                { name: { $regex: query, $options: 'i' } },
                { 'address.city': { $regex: query, $options: 'i' } },
                { 'address.street': { $regex: query, $options: 'i' } },
            ];
        }

        if (specialty) {
            filter.specialties = specialty;
        }

        const hospitals = await Hospital.find(filter);
        return hospitals;
    } catch (error) {
        throw new Error('Error searching hospitals: ' + error.message);
    }
};

const findNearbyHospitals = async (latitude, longitude, radius) => {
    try {
        const hospitals = await Hospital.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: radius,
                },
            },
        });
        return hospitals;
    } catch (error) {
        throw new Error('Error finding nearby hospitals: ' + error.message);
    }
};

const getEmergencyHospitals = async (lat, lng) => {
    try {
        let filter = {
            'emergencyServices.ambulance': true,
            'operatingHours.emergency24x7': true,
        };

        if (lat && lng) {
            const hospitals = await Hospital.find({
                ...filter,
                location: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [lng, lat],
                        },
                    },
                },
            });
            return hospitals;
        } else {
            const hospitals = await Hospital.find(filter);
            return hospitals;
        }
    } catch (error) {
        throw new Error('Error getting emergency hospitals: ' + error.message);
    }
};

module.exports = {
    getAllHospitals,
    getHospitalById,
    createHospital,
    updateHospital,
    deleteHospital,
    getSpecialties,
    searchHospitals,
    findNearbyHospitals,
    getEmergencyHospitals,
};
