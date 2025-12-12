import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// User API
export const userAPI = {
    getAll: () => api.get('/users'),
    getById: (id) => api.get(`/users/${id}`),
    createOrFind: (userData) => api.post('/users', userData),
};

// Court API
export const courtAPI = {
    getAll: () => api.get('/courts'),
    getById: (id) => api.get(`/courts/${id}`),
    create: (courtData) => api.post('/courts', courtData),
    update: (id, courtData) => api.put(`/courts/${id}`, courtData),
    delete: (id) => api.delete(`/courts/${id}`),
};

// Coach API
export const coachAPI = {
    getAll: () => api.get('/coaches'),
    getById: (id) => api.get(`/coaches/${id}`),
    create: (coachData) => api.post('/coaches', coachData),
    update: (id, coachData) => api.put(`/coaches/${id}`, coachData),
    delete: (id) => api.delete(`/coaches/${id}`),
};

// Equipment API
export const equipmentAPI = {
    getAll: () => api.get('/equipment'),
    getById: (id) => api.get(`/equipment/${id}`),
    create: (equipmentData) => api.post('/equipment', equipmentData),
    update: (id, equipmentData) => api.put(`/equipment/${id}`, equipmentData),
    delete: (id) => api.delete(`/equipment/${id}`),
};

// Pricing Rule API
export const pricingRuleAPI = {
    getAll: () => api.get('/pricing-rules'),
    getById: (id) => api.get(`/pricing-rules/${id}`),
    create: (ruleData) => api.post('/pricing-rules', ruleData),
    update: (id, ruleData) => api.put(`/pricing-rules/${id}`, ruleData),
    delete: (id) => api.delete(`/pricing-rules/${id}`),
};

// Booking API
export const bookingAPI = {
    create: (bookingData) => api.post('/bookings', bookingData),
    getUserBookings: (userId) => api.get(`/bookings/user/${userId}`),
    getAll: () => api.get('/bookings'),
    getById: (id) => api.get(`/bookings/${id}`),
    cancel: (id) => api.delete(`/bookings/${id}`),
};

// Utility API
export const utilsAPI = {
    checkAvailability: (data) => api.post('/utils/check', data),
    calculatePrice: (data) => api.post('/utils/calculate-price', data),
};

export default api;
