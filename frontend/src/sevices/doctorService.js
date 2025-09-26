import apiService from "./api";

class DoctorService {
    async getDoctors() {
        return await apiService.request('/api/doctors');
    }

    async getDoctorDashboard() {
        return await apiService.request('/api/doctors/dashboard');
    }
}

export default new DoctorService();
