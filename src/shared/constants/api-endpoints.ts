/**
 * API endpoint constants
 * Centralized API route definitions
 */

/**
 * Base API path
 */
export const API_BASE = '/api';

/**
 * API endpoint paths
 */
export const API_ENDPOINTS = {
  /** Get workout data */
  WORKOUTS: `${API_BASE}/workouts`,

  /** Health check endpoint */
  HEALTH: `${API_BASE}/health`,

  /** Authentication verification */
  AUTH_VERIFY: `${API_BASE}/auth/verify`,
} as const;

/**
 * API endpoint type (for type safety)
 */
export type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS];

/**
 * HTTP methods
 */
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
} as const;

export type HttpMethod = typeof HTTP_METHODS[keyof typeof HTTP_METHODS];

/**
 * API response status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];
