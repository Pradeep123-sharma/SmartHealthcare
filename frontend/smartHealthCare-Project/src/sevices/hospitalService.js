import api from './api';

const hospitalService = {
    getSpecialties: async () => {
        return await api.request('/api/hospitals/specialties');
    },

    search: async (params) => {
        const query = new URLSearchParams(params).toString();
        return await api.request(`/api/hospitals/search?${query}`);
    },

    findNearby: async (params) => {
        const query = new URLSearchParams(params).toString();
        return await api.request(`/api/hospitals/nearby?${query}`);
    },

    getEmergency: async (params) => {
        const query = new URLSearchParams(params).toString();
        return await api.request(`/api/hospitals/emergency?${query}`);
    },
};

export default hospitalService;
