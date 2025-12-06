/**
 * Routes index
 * Registers all application routes
 */

import { Router } from 'express';
import { createWorkoutsRouter } from './workouts.routes';
import { WorkoutsController } from '../controllers/workouts.controller';

/**
 * Create API router with all routes
 * @param workoutsController - Workouts controller instance
 * @returns Express router with all routes
 */
export function createApiRouter(
  workoutsController: WorkoutsController
): Router {
  const router = Router();

  // Register workouts routes
  const workoutsRouter = createWorkoutsRouter(workoutsController);
  router.use('/api', workoutsRouter);

  // Health check endpoint
  router.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  return router;
}
