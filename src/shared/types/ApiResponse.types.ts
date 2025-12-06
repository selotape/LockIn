/**
 * API response types
 * Standard response formats for HTTP endpoints
 */

import { Workout } from './Workout.types';

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  /** Indicates if the request was successful */
  success: boolean;

  /** Response data (present on success) */
  data?: T;

  /** Error message (present on failure) */
  error?: string;

  /** Additional error details (present on failure) */
  details?: string;
}

/**
 * Response for workout data endpoint
 */
export interface WorkoutsResponse {
  /** Array of workout sessions */
  workouts: Workout[];

  /** Total count of workouts returned */
  totalCount: number;
}

/**
 * Error response details
 */
export interface ErrorResponse {
  /** HTTP status code */
  statusCode: number;

  /** Error message */
  message: string;

  /** Error code (e.g., "UNAUTHORIZED", "INVALID_TOKEN") */
  code: string;

  /** Timestamp of the error */
  timestamp: string;
}

/**
 * Health check response
 */
export interface HealthCheckResponse {
  /** Service status */
  status: 'healthy' | 'unhealthy';

  /** Service version */
  version: string;

  /** Timestamp */
  timestamp: string;

  /** Additional service information */
  info?: Record<string, unknown>;
}
