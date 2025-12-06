/**
 * Tests for GetWorkouts use case
 */

import { GetWorkoutsUseCase } from '@/backend/domain/use-cases/GetWorkouts.usecase';
import { IWorkoutRepository } from '@/backend/services/interfaces/IWorkoutRepository';
import { IAuthService } from '@/backend/services/interfaces/IAuthService';
import { Workout } from '@/backend/domain/models/Workout';

describe('GetWorkoutsUseCase', () => {
  let useCase: GetWorkoutsUseCase;
  let mockRepository: jest.Mocked<IWorkoutRepository>;
  let mockAuthService: jest.Mocked<IAuthService>;

  beforeEach(() => {
    // Create mock repository
    mockRepository = {
      findByDateRange: jest.fn(),
    };

    // Create mock auth service
    mockAuthService = {
      validateToken: jest.fn(),
      getUserInfo: jest.fn(),
    };

    useCase = new GetWorkoutsUseCase(mockRepository, mockAuthService);
  });

  describe('execute', () => {
    it('should return sorted workouts for valid token', async () => {
      const userId = 'user-123';
      const accessToken = 'valid-token';
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
        {
          id: 'workout-2',
          name: 'Yoga',
          activityType: 102,
          startTime: '2024-06-03T10:00:00Z',
          endTime: '2024-06-03T11:00:00Z',
          duration: 3600000,
          description: 'Yoga session',
          application: 'Test App',
        },
        {
          id: 'workout-3',
          name: 'Biking',
          activityType: 1,
          startTime: '2024-06-02T10:00:00Z',
          endTime: '2024-06-02T11:00:00Z',
          duration: 3600000,
          description: 'Bike ride',
          application: 'Test App',
        },
      ];

      mockAuthService.validateToken.mockResolvedValue(true);
      mockRepository.findByDateRange.mockResolvedValue(mockWorkouts);

      const result = await useCase.execute(userId, accessToken);

      // Verify token validation
      expect(mockAuthService.validateToken).toHaveBeenCalledWith(accessToken);

      // Verify repository was called with correct date range
      expect(mockRepository.findByDateRange).toHaveBeenCalledWith(
        userId,
        expect.any(Date),
        expect.any(Date),
        accessToken
      );

      // Verify results are sorted by start time (most recent first)
      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('workout-2'); // June 3rd
      expect(result[1].id).toBe('workout-3'); // June 2nd
      expect(result[2].id).toBe('workout-1'); // June 1st
    });

    it('should throw error for invalid token', async () => {
      const userId = 'user-123';
      const accessToken = 'invalid-token';

      mockAuthService.validateToken.mockResolvedValue(false);

      await expect(useCase.execute(userId, accessToken)).rejects.toThrow(
        'Invalid or expired access token'
      );

      // Repository should not be called if token is invalid
      expect(mockRepository.findByDateRange).not.toHaveBeenCalled();
    });

    it('should calculate 300 day date range', async () => {
      const userId = 'user-123';
      const accessToken = 'valid-token';

      mockAuthService.validateToken.mockResolvedValue(true);
      mockRepository.findByDateRange.mockResolvedValue([]);

      await useCase.execute(userId, accessToken);

      // Get the dates that were passed to the repository
      const call = mockRepository.findByDateRange.mock.calls[0];
      const startDate = call[1] as Date;
      const endDate = call[2] as Date;

      // Calculate the difference in days
      const daysDifference = Math.floor(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Should be approximately 300 days (allowing for small timing differences)
      expect(daysDifference).toBeGreaterThanOrEqual(299);
      expect(daysDifference).toBeLessThanOrEqual(301);
    });

    it('should pass access token to repository', async () => {
      const userId = 'user-123';
      const accessToken = 'valid-token';

      mockAuthService.validateToken.mockResolvedValue(true);
      mockRepository.findByDateRange.mockResolvedValue([]);

      await useCase.execute(userId, accessToken);

      expect(mockRepository.findByDateRange).toHaveBeenCalledWith(
        userId,
        expect.any(Date),
        expect.any(Date),
        accessToken
      );
    });

    it('should handle empty workout list', async () => {
      const userId = 'user-123';
      const accessToken = 'valid-token';

      mockAuthService.validateToken.mockResolvedValue(true);
      mockRepository.findByDateRange.mockResolvedValue([]);

      const result = await useCase.execute(userId, accessToken);

      expect(result).toEqual([]);
    });

    it('should propagate repository errors', async () => {
      const userId = 'user-123';
      const accessToken = 'valid-token';

      mockAuthService.validateToken.mockResolvedValue(true);
      mockRepository.findByDateRange.mockRejectedValue(
        new Error('Repository error')
      );

      await expect(useCase.execute(userId, accessToken)).rejects.toThrow(
        'Repository error'
      );
    });
  });
});
