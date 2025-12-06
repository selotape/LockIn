/**
 * Tests for WorkoutRepository
 */

import { WorkoutRepository } from '@/backend/domain/repositories/WorkoutRepository';
import { IFitnessService } from '@/backend/services/interfaces/IFitnessService';
import { Workout } from '@/backend/domain/models/Workout';

describe('WorkoutRepository', () => {
  let repository: WorkoutRepository;
  let mockFitnessService: jest.Mocked<IFitnessService>;

  beforeEach(() => {
    // Create mock fitness service
    mockFitnessService = {
      getWorkouts: jest.fn(),
      getActivityName: jest.fn(),
    };

    repository = new WorkoutRepository(mockFitnessService);
  });

  describe('findByDateRange', () => {
    it('should delegate to fitness service', async () => {
      const userId = 'user-123';
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      const accessToken = 'mock-token';
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

      mockFitnessService.getWorkouts.mockResolvedValue(mockWorkouts);

      const result = await repository.findByDateRange(
        userId,
        startDate,
        endDate,
        accessToken
      );

      expect(mockFitnessService.getWorkouts).toHaveBeenCalledWith(
        accessToken,
        startDate,
        endDate
      );
      expect(result).toEqual(mockWorkouts);
    });

    it('should pass through errors from fitness service', async () => {
      const userId = 'user-123';
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      const accessToken = 'mock-token';

      mockFitnessService.getWorkouts.mockRejectedValue(
        new Error('API Error')
      );

      await expect(
        repository.findByDateRange(userId, startDate, endDate, accessToken)
      ).rejects.toThrow('API Error');
    });
  });
});
