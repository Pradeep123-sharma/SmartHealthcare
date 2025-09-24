const API_BASE_URL = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:5000';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        };

        const token = this.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (config.body && typeof config.body !== 'string') {
            config.body = JSON.stringify(config.body);
        }

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData?.message || errorData?.detail || JSON.stringify(errorData);
                } catch (e) { /* Ignore if response is not JSON */ }
                throw new Error(errorMessage);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }

            return await response.text();
        } catch (error) {
            console.error(`API request failed for ${endpoint}:`, error);
            throw error;
        }
    }

    // Authentication
    async register(userData) {
        const response = await this.request('/api/auth/register', {
            method: 'POST',
            body: userData,
        });

        if (response.token) {
            localStorage.setItem('auth_token', response.token);
            localStorage.setItem('user_data', JSON.stringify(response.user));
        }

        return response;
    }

    async login(credentials) {
        const response = await this.request('/api/auth/login', {
            method: 'POST',
            body: credentials,
        });

        if (response.token) {
            localStorage.setItem('auth_token', response.token);
            localStorage.setItem('user_data', JSON.stringify(response.user));
        }

        return response;
    }

    async sendOTP(phoneData) {
        return await this.request('/api/auth/send-otp', {
            method: 'POST',
            body: phoneData,
        });
    }

    async verifyOTP(verificationData) {
        return await this.request('/api/auth/verify-otp', {
            method: 'POST',
            body: verificationData,
        });
    }

    // Symptom Checker
    async checkSymptoms(symptomData) {
        return await this.request('/api/symptoms/check', {
            method: 'POST',
            body: symptomData,
        });
    }

    // Doctors
    async getDoctors() {
        return await this.request('/api/doctors');
    }

    async getDoctorDashboard() {
        return await this.request('/api/doctors/dashboard');
    }

    // Patient Dashboard
    async getPatientDashboard() {
        return await this.request('/api/patient/dashboard');
    }

    // Patient Health Summary
    async getHealthSummary() {
        return await this.request('/api/patient/health-summary');
    }

    // Appointments
    async bookAppointment(appointmentData) {
        return await this.request('/api/appointments/book', {
            method: 'POST',
            body: appointmentData,
        });
    }

    async getAppointments() {
        return await this.request('/api/appointments');
    }

    // Health Records
    async addHealthRecord(recordData) {
        return await this.request('/api/health-records', {
            method: 'POST',
            body: recordData,
        });
    }

    async getHealthRecords(patientId) {
        return await this.request(`/api/health-records/${patientId}`);
    }

    // Hospitals
    async getNearbyHospitals(lat, lng, radius = 5000) {
        return await this.request(`/api/hospitals/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
    }

    // Emergency
    async triggerSOS(emergencyData) {
        return await this.request('/api/emergency/sos', {
            method: 'POST',
            body: emergencyData,
        });
    }

    // Utility methods
    logout() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        localStorage.removeItem('healthcare_user');
    }

    getCurrentUser() {
        const userData = localStorage.getItem('user_data');
        return userData ? JSON.parse(userData) : null;
    }

    getToken() {
        return localStorage.getItem('auth_token');
    }

    isAuthenticated() {
        return !!this.getToken();
    }
}

export default new ApiService();