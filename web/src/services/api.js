import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (data) => api.post('/auth/register', data);
export const getMe = () => api.get('/auth/me');

// Customers
export const getCustomers = () => api.get('/customers');
export const getCustomer = (id) => api.get(`/customers/${id}`);
export const createCustomer = (data) => api.post('/customers', data);
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`);

// Chit Plans
export const getChitPlans = () => api.get('/chitplans');
export const getChitPlan = (id) => api.get(`/chitplans/${id}`);
export const createChitPlan = (data) => api.post('/chitplans', data);
export const updateChitPlan = (id, data) => api.put(`/chitplans/${id}`, data);
export const deleteChitPlan = (id) => api.delete(`/chitplans/${id}`);

// Chits
export const getChits = () => api.get('/chits');
export const getChit = (id) => api.get(`/chits/${id}`);
export const createChit = (data) => api.post('/chits', data);
export const updateChit = (id, data) => api.put(`/chits/${id}`, data);
export const deleteChit = (id) => api.delete(`/chits/${id}`);
export const addMember = (id, data) => api.post(`/chits/${id}/members`, data);
export const removeMember = (id, memberId) => api.delete(`/chits/${id}/members/${memberId}`);

// Payments
export const getPayments = (params) => api.get('/payments', { params });
export const getPayment = (id) => api.get(`/payments/${id}`);
export const createPayment = (data) => api.post('/payments', data);
export const updatePayment = (id, data) => api.put(`/payments/${id}`, data);
export const deletePayment = (id) => api.delete(`/payments/${id}`);
export const getPendingPayments = () => api.get('/payments/pending/all');

// Bids
export const getBids = (params) => api.get('/bids', { params });
export const getBid = (id) => api.get(`/bids/${id}`);
export const createBid = (data) => api.post('/bids', data);
export const updateBid = (id, data) => api.put(`/bids/${id}`, data);
export const deleteBid = (id) => api.delete(`/bids/${id}`);

// Reports
export const getDashboardStats = () => api.get('/reports/dashboard');
export const getChitReport = (id) => api.get(`/reports/chit/${id}`);
export const getCustomerReport = (id) => api.get(`/reports/customer/${id}`);
export const exportPayments = () => api.get('/reports/export/payments', { responseType: 'blob' });

// Employees
export const getEmployees = () => api.get('/employees');
export const getEmployee = (id) => api.get(`/employees/${id}`);
export const updateEmployee = (id, data) => api.put(`/employees/${id}`, data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);

export default api;
