// Centralized API configuration
// Use environment variable for deployment, fallback to localhost for development
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
export const API_ENDPOINT = `${API_BASE_URL}/api`;
