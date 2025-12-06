/**
 * CORS middleware
 * Handles Cross-Origin Resource Sharing
 * Extracted from functions/index.js lines 5-6
 */

import cors from 'cors';

/**
 * CORS configuration
 * Allows requests from any origin in development
 */
export const corsMiddleware = cors({
  origin: true, // Allow all origins (can be restricted in production)
  credentials: true,
});
