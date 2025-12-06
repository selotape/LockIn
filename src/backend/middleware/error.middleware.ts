/**
 * Error handling middleware
 * Centralizes error handling and response formatting
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Error middleware
 * Catches and formats errors
 */
export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error occurred:', error);

  // Determine status code based on error message
  let statusCode = 500;
  let errorMessage = error.message || 'Internal server error';

  if (errorMessage.includes('Invalid or expired access token')) {
    statusCode = 401;
  } else if (errorMessage.includes('Insufficient permissions')) {
    statusCode = 403;
  } else if (errorMessage.includes('not found')) {
    statusCode = 404;
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: errorMessage,
    details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  });
}
