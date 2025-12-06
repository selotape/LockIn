/**
 * Tests for Workouts API endpoints
 * Uses supertest for HTTP testing
 */

import request from 'supertest';
import { Express } from 'express';
import express from 'express';
import { WorkoutsController } from '@/backend/controllers/workouts.controller';
import { GetWorkoutsUseCase } from '@/backend/domain/use-cases/GetWorkouts.usecase';
import { createApiRouter } from '@/backend/routes/index';
import { corsMiddleware } from '@/backend/middleware/cors.middleware';
import { errorMiddleware } from '@/backend/middleware/error.middleware';
import { Workout } from '@/backend/domain/models/Workout';

describe('Workouts API', () => {
  let app: Express;
  let mockGetWorkoutsUseCase: jest.Mocked<GetWorkoutsUseCase>;

  beforeEach(() => {
    // Create mock use case
    mockGetWorkoutsUseCase = {
      execute: jest.fn(),
    } as any;

    // Create controller
    const controller = new WorkoutsController(mockGetWorkoutsUseCase);

    // Create Express app
    app = express();
    app.use(corsMiddleware);
    app.use(express.json());

    // Register routes
    const router = createApiRouter(controller);
    app.use(router);

    // Error middleware
    app.use(errorMiddleware);
  });

  describe('GET /api/workouts', () => {
    it('should return workouts with valid token', async () => {
      const mockWorkouts: Workout[] = [
        {
          id: 'workout-1',
          name: 'Running',
          activityType: 8,
          startTime: '2024-06-01T10:00:00Z',
          endTime: '2024-06-01T11:00:00Z',
          duration: 3600000,
          description: 'Morning run',
          application: 'Test App',
        },
      ];

      mockGetWorkoutsUseCase.execute.mockResolvedValue(mockWorkouts);

      const response = await request(app)
        .get('/api/workouts')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        workouts: mockWorkouts,
        totalCount: 1,
      });

      expect(mockGetWorkoutsUseCase.execute).toHaveBeenCalledWith(
        'me',
        'valid-token'
      );
    });

    it('should return 401 without Authorization header', async () => {
      const response = await request(app).get('/api/workouts').expect(401);

      expect(response.body).toEqual({
        success: false,
        error: 'Missing Authorization header',
      });

      expect(mockGetWorkoutsUseCase.execute).not.toHaveBeenCalled();
    });

    it('should return 401 with invalid Authorization format', async () => {
      const response = await request(app)
        .get('/api/workouts')
        .set('Authorization', 'InvalidFormat token')
        .expect(401);

      expect(response.body).toEqual({
        success: false,
        error:
          'Invalid Authorization header format. Expected: Bearer <token>',
      });

      expect(mockGetWorkoutsUseCase.execute).not.toHaveBeenCalled();
    });

    it('should return 401 with empty token', async () => {
      const response = await request(app)
        .get('/api/workouts')
        .set('Authorization', 'Bearer ')
        .expect(401);

      expect(response.body).toEqual({
        success: false,
        error: 'Empty access token',
      });

      expect(mockGetWorkoutsUseCase.execute).not.toHaveBeenCalled();
    });

    it('should return 401 for invalid token', async () => {
      mockGetWorkoutsUseCase.execute.mockRejectedValue(
        new Error('Invalid or expired access token')
      );

      const response = await request(app)
        .get('/api/workouts')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid or expired access token');
    });

    it('should return empty array if no workouts', async () => {
      mockGetWorkoutsUseCase.execute.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/workouts')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        workouts: [],
        totalCount: 0,
      });
    });
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/api/health').expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});
