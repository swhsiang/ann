/**
 * Utility functions for Electron main process
 */

/**
 * Check if the application is running in development mode
 */
export const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;