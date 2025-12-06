/**
 * Workouts controller
 * Handles HTTP requests for workout data
 * Extracted from functions/index.js lines 8-93
 */

import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { GetWorkoutsUseCase } from '../domain/use-cases/GetWorkouts.usecase';

/**
 * Workouts controller class
 */
export class WorkoutsController {
  constructor(private readonly getWorkoutsUseCase: GetWorkoutsUseCase) {}

  /**
   * Get workouts handler
   * GET /api/workouts
   */
  async getWorkouts(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Access token is guaranteed to exist by auth middleware
      const accessToken = req.accessToken!;

      // Use a generic user ID (in a real app, this would come from the token)
      const userId = 'me';

      // Execute use case
      const workouts = await this.getWorkoutsUseCase.execute(
        userId,
        accessToken
      );

      // Send successful response
      res.json({
        success: true,
        workouts,
        totalCount: workouts.length,
      });
    } catch (error) {
      // Pass error to error middleware
      next(error);
    }
  }
}
