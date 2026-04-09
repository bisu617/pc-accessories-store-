import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach JWT
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Don't redirect if already on auth page
      if (window.location && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { firstName: string; lastName: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: { firstName?: string; lastName?: string; email?: string }) =>
    api.put('/auth/profile', data),
};

// Products API
export const productsAPI = {
  getAll: (params?: { category?: string; sort?: string; search?: string }) =>
    api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
};

// Cart API
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (productId: string, quantity: number = 1) =>
    api.post('/cart', { productId, quantity }),
  update: (productId: string, quantity: number) =>
    api.put(`/cart/${productId}`, { quantity }),
  remove: (productId: string) => api.delete(`/cart/${productId}`),
  clear: () => api.delete('/cart'),
};

// Orders API
export const ordersAPI = {
  create: (shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }) => api.post('/orders', { shippingAddress }),
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
};

// Wishlist API
export const wishlistAPI = {
  get: () => api.get('/wishlist'),
  toggle: (productId: string) => api.post(`/wishlist/${productId}`),
};

// Image URL helper
export const getImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_URL}${imagePath}`;
};

export default api;
