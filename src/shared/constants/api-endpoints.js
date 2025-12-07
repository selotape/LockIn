"use strict";
/**
 * API endpoint constants
 * Centralized API route definitions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP_STATUS = exports.HTTP_METHODS = exports.API_ENDPOINTS = exports.API_BASE = void 0;
/**
 * Base API path
 */
exports.API_BASE = '/api';
/**
 * API endpoint paths
 */
exports.API_ENDPOINTS = {
    /** Get workout data */
    WORKOUTS: `${exports.API_BASE}/workouts`,
    /** Health check endpoint */
    HEALTH: `${exports.API_BASE}/health`,
    /** Authentication verification */
    AUTH_VERIFY: `${exports.API_BASE}/auth/verify`,
};
/**
 * HTTP methods
 */
exports.HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH',
};
/**
 * API response status codes
 */
exports.HTTP_STATUS = {
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
};
//# sourceMappingURL=api-endpoints.js.map