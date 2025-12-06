/**
 * Workouts routes
 * Defines routes for workout endpoints
 */

import { Router } from 'express';
import { WorkoutsController } from '../controllers/workouts.controller';
import { authMiddleware } from '../middleware/auth.middleware';

/**
 * Create workouts router
 * @param controller - Workouts controller instance
 * @returns Express router
 */
export function createWorkoutsRouter(
  controller: WorkoutsController
): Router {
  const router = Router();

  /**
   * GET /api/workouts
   * Get user's workout data
   * Requires: Authorization header with Bearer token
   */
  router.get(
    '/workouts',
    authMiddleware,
    (req, res, next) => controller.getWorkouts(req, res, next)
  );

  return router;
}
