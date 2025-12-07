/**
 * API endpoint constants
 * Centralized API route definitions
 */
/**
 * Base API path
 */
export declare const API_BASE = "/api";
/**
 * API endpoint paths
 */
export declare const API_ENDPOINTS: {
    /** Get workout data */
    readonly WORKOUTS: "/api/workouts";
    /** Health check endpoint */
    readonly HEALTH: "/api/health";
    /** Authentication verification */
    readonly AUTH_VERIFY: "/api/auth/verify";
};
/**
 * API endpoint type (for type safety)
 */
export type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS];
/**
 * HTTP methods
 */
export declare const HTTP_METHODS: {
    readonly GET: "GET";
    readonly POST: "POST";
    readonly PUT: "PUT";
    readonly DELETE: "DELETE";
    readonly PATCH: "PATCH";
};
export type HttpMethod = typeof HTTP_METHODS[keyof typeof HTTP_METHODS];
/**
 * API response status codes
 */
export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly METHOD_NOT_ALLOWED: 405;
    readonly INTERNAL_SERVER_ERROR: 500;
    readonly SERVICE_UNAVAILABLE: 503;
};
export type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];
//# sourceMappingURL=api-endpoints.d.ts.map