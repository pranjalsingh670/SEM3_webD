/**
 * Central API Configuration
 * 
 * Keep the backend base URL in one easy-to-modify place.
 * By default, connects to the local Express backend on port 5000.
 */
export const API_BASE_URL = 'http://localhost:5000';

export const API_ENDPOINTS = {
  searchFiles: (query = '') => `${API_BASE_URL}/api/files/search?q=${encodeURIComponent(query)}`,
  downloadFile: (filename) => `${API_BASE_URL}/api/files/download/${encodeURIComponent(filename)}`,
  health: `${API_BASE_URL}/api/health`,
};
