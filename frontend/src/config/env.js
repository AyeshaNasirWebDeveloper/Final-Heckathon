/**
 * Environment configuration
 * This file centralizes all environment variables for easy access
 */

// API URL from environment variables
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// App information
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Task Tracker';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

// Theme settings
export const DEFAULT_THEME_COLOR = import.meta.env.VITE_DEFAULT_THEME_COLOR || '#651fff';

// Environment type
export const IS_DEV = import.meta.env.DEV;
export const IS_PROD = import.meta.env.PROD;

// Log environment info in development
if (IS_DEV) {
  console.log('Environment:', IS_DEV ? 'Development' : 'Production');
  console.log('API URL:', API_URL);
  console.log('App:', APP_NAME, APP_VERSION);
}

export default {
  API_URL,
  APP_NAME,
  APP_VERSION,
  DEFAULT_THEME_COLOR,
  IS_DEV,
  IS_PROD
};
