import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
});

// Response interceptor to handle token expiration globally
api.interceptors.response.use(
  (response) => {
    // If response is successful, just return it
    return response;
  },
  (error) => {
    // If response has 401 status (unauthorized/expired token)
    if (error.response && error.response.status === 401) {
      // Check if error message indicates token expiration
      const errorMsg = error.response.data?.errors || '';
      
      if (errorMsg.includes('token') || errorMsg.includes('expired')) {
        // Clear both user and admin tokens
        localStorage.removeItem('user');
        localStorage.removeItem('admin');
        
        // Redirect to appropriate login page based on current path
        const currentPath = window.location.pathname;
        if (currentPath.includes('/admin')) {
          window.location.href = '/admin/login';
        } else {
          window.location.href = '/login';
        }
      }
    }
    
    // Return the error so it can still be handled by the calling code
    return Promise.reject(error);
  }
);

export default api;
