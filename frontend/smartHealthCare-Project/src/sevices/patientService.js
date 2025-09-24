import apiService from "./api";

class PatientService {
    async getPatientDashboard() {
        return await apiService.request('/api/patients/dashboard');
    }

    async getHealthSummary() {
        return await apiService.request('/api/patients/health-summary');
    }

    async bookAppointment(appointmentData) {
        return await apiService.request('/api/appointments/book', {
            method: 'POST',
            body: appointmentData,
        });
    }

    async getAppointments() {
        return await apiService.request('/api/appointments');
    }

    async addHealthRecord(recordData) {
        return await apiService.request('/api/health-records', {
            method: 'POST',
            body: recordData,
        });
    }

    async getHealthRecords(patientId) {
        return await apiService.request(`/api/health-records/${patientId}`);
    }
}

export default new PatientService();
