/**
 * Express server
 * Main entry point for the backend application
 * Replaces server.js
 */

import express, { Express } from 'express';
import path from 'path';
import { AppConfig } from './infrastructure/config/app.config';
import { ServiceFactory } from './services/ServiceFactory';
import { WorkoutRepository } from './domain/repositories/WorkoutRepository';
import { GetWorkoutsUseCase } from './domain/use-cases/GetWorkouts.usecase';
import { WorkoutsController } from './controllers/workouts.controller';
import { createApiRouter } from './routes/index';
import { corsMiddleware } from './middleware/cors.middleware';
import { errorMiddleware } from './middleware/error.middleware';

/**
 * Create and configure Express application
 * @returns Configured Express app
 */
export function createApp(): Express {
  const app = express();

  // Log configuration
  AppConfig.logConfig();
  ServiceFactory.logConfiguration();

  // Middleware
  app.use(corsMiddleware);
  app.use(express.json());

  // Initialize services
  const fitnessService = ServiceFactory.getFitnessService();
  const authService = ServiceFactory.getAuthService();

  // Initialize domain layer
  const workoutRepository = new WorkoutRepository(fitnessService);
  const getWorkoutsUseCase = new GetWorkoutsUseCase(
    workoutRepository,
    authService
  );

  // Initialize controllers
  const workoutsController = new WorkoutsController(getWorkoutsUseCase);

  // Register API routes
  const apiRouter = createApiRouter(workoutsController);
  app.use(apiRouter);

  // Serve static files from public directory
  app.use(express.static(path.join(__dirname, '../../public')));

  // Error handling middleware (must be last)
  app.use(errorMiddleware);

  return app;
}

/**
 * Start the server
 */
export function startServer(): void {
  const app = createApp();
  const port = AppConfig.PORT;

  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📊 Environment: ${AppConfig.NODE_ENV}`);
    console.log(`🎭 Mock mode: ${AppConfig.USE_MOCKS ? 'ENABLED' : 'DISABLED'}`);
  });
}

// Start server if this file is run directly
if (require.main === module) {
  startServer();
}
