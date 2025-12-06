/**
 * Authentication middleware
 * Extracts and validates Bearer token from Authorization header
 * Extracted from functions/index.js lines 10-22
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Extended Request interface with token
 */
export interface AuthenticatedRequest extends Request {
  accessToken?: string;
}

/**
 * Auth middleware
 * Extracts Bearer token from Authorization header
 */
export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  // Check if Authorization header is present
  if (!authHeader) {
    res.status(401).json({
      success: false,
      error: 'Missing Authorization header',
    });
    return;
  }

  // Check if it's a Bearer token
  if (!authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'Invalid Authorization header format. Expected: Bearer <token>',
    });
    return;
  }

  // Extract token
  const accessToken = authHeader.substring(7); // Remove "Bearer " prefix

  // Check if token is non-empty
  if (!accessToken || accessToken.trim() === '') {
    res.status(401).json({
      success: false,
      error: 'Empty access token',
    });
    return;
  }

  // Attach token to request object
  req.accessToken = accessToken;

  // Continue to next middleware
  next();
}
