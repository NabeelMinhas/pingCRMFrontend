import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { ApiError, Company, Contact, PaginatedResponse } from '../types';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (!error.response) {
      console.error('Network error: Unable to reach the server');
    } else {
      const status = error.response.status;
      if (status === 401) {
        console.error('Authentication error: Please login again');
        // Handle logout here if needed
      } else if (status === 403) {
        console.error('Permission denied: You do not have access to this resource');
      } else if (status === 404) {
        console.error('Resource not found');
      } else if (status >= 500) {
        console.error('Server error occurred');
      }
    }
    return Promise.reject(error);
  }
);

// Contacts API
export const contactsApi = {
  getAll: async (page = 1, size = 10, search?: string): Promise<PaginatedResponse<Contact>> => {
    const params = { page, size, search };
    const response: AxiosResponse<PaginatedResponse<Contact>> = await api.get('/contacts', { params });
    return response.data;
  },
  
  getById: async (id: string | number): Promise<Contact> => {
    const response: AxiosResponse<Contact> = await api.get(`/contacts/${id}`);
    return response.data;
  },
  
  create: async (contact: Contact): Promise<Contact> => {
    const response: AxiosResponse<Contact> = await api.post('/contacts', contact);
    return response.data;
  },
  
  update: async (id: string | number, contact: Contact): Promise<Contact> => {
    const response: AxiosResponse<Contact> = await api.put(`/contacts/${id}`, contact);
    return response.data;
  },
  
  delete: async (id: string | number): Promise<void> => {
    await api.delete(`/contacts/${id}`);
  },
};

// Companies API
export const companiesApi = {
  getAll: async (page = 1, size = 10, search?: string): Promise<PaginatedResponse<Company>> => {
    const params = { page, size, search };
    const response: AxiosResponse<PaginatedResponse<Company>> = await api.get('/companies', { params });
    return response.data;
  },
  
  getById: async (id: string | number): Promise<Company> => {
    const response: AxiosResponse<Company> = await api.get(`/companies/${id}`);
    return response.data;
  },
  
  create: async (company: Company): Promise<Company> => {
    const response: AxiosResponse<Company> = await api.post('/companies', company);
    return response.data;
  },
  
  update: async (id: string | number, company: Company): Promise<Company> => {
    const response: AxiosResponse<Company> = await api.put(`/companies/${id}`, company);
    return response.data;
  },
  
  delete: async (id: string | number): Promise<void> => {
    await api.delete(`/companies/${id}`);
  },
};

export default api; 