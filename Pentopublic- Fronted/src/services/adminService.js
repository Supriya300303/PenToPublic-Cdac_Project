// src/services/adminService.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const adminService = {
  async getDashboard() {
    const res = await api.get('/Admin/dashboard');
    return res.data;
  },
  async getPendingBooks() {
    const res = await api.get('/Admin/pending-books');
    return res.data;
  },
  async getBooksSummary() {
    const res = await api.get('/Admin/books/summary');
    return res.data;
  },
  async getReaders() {
    const res = await api.get('/Admin/readers');
    return res.data;
  },
  async getAuthors() {
    const res = await api.get('/Admin/authors');
    return res.data;
  },
  async approveBook(bookId) {
    const res = await api.post(`/Admin/approve/${bookId}`);
    return res.data;
  },
  async rejectBook(bookId) {
    const res = await api.post(`/Admin/reject/${bookId}`);
    return res.data;
  },
  async getBookDetails(bookId) {
    const res = await api.get(`/Admin/books/${bookId}`);
    return res.data;
  },
  async updateBookStatus(bookId, status) {
    const res = await api.put(`/Admin/books/${bookId}/status`, { status });
    return res.data;
  },
  async deleteBook(bookId) {
    const res = await api.delete(`/Admin/books/${bookId}`);
    return res.data;
  },
  async getUserDetails(userId) {
    const res = await api.get(`/Admin/users/${userId}`);
    return res.data;
  },
  async updateUserStatus(userId, isActive) {
    const res = await api.put(`/Admin/users/${userId}/status`, { isActive });
    return res.data;
  },
  async getAnalytics(dateRange) {
    const res = await api.get('/Admin/analytics', { params: dateRange });
    return res.data;
  },
  async exportData(type, format = 'csv') {
    const res = await api.get(`/Admin/export/${type}`, {
      params: { format },
      responseType: 'blob'
    });
    return res.data;
  }
};

export default adminService;
