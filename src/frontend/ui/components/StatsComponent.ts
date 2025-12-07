/**
 * Stats Component
 * Renders workout statistics
 */

import { Workout } from '@/shared/types/Workout.types';
import { StatsCalculator } from '@/frontend/domain/calculators/StatsCalculator';

/**
 * Statistics component for displaying workout stats
 */
export class StatsComponent {
  private totalWorkoutsEl: HTMLElement;
  private totalTimeEl: HTMLElement;
  private mostActiveDayEl: HTMLElement;

  constructor(
    totalWorkoutsId: string = 'total-workouts',
    totalTimeId: string = 'total-time',
    mostActiveDayId: string = 'most-active-day'
  ) {
    const totalWorkoutsEl = document.getElementById(totalWorkoutsId);
    const totalTimeEl = document.getElementById(totalTimeId);
    const mostActiveDayEl = document.getElementById(mostActiveDayId);

    if (!totalWorkoutsEl || !totalTimeEl || !mostActiveDayEl) {
      throw new Error('Stats elements not found');
    }

    this.totalWorkoutsEl = totalWorkoutsEl;
    this.totalTimeEl = totalTimeEl;
    this.mostActiveDayEl = mostActiveDayEl;
  }

  /**
   * Render statistics
   */
  render(workouts: Workout[]): void {
    const stats = StatsCalculator.calculateStats(workouts);

    // Update DOM
    this.totalWorkoutsEl.textContent = stats.totalWorkouts.toString();
    this.totalTimeEl.textContent = `${stats.totalTimeHours}h`;
    this.mostActiveDayEl.textContent = stats.mostActiveDay;
  }

  /**
   * Clear statistics
   */
  clear(): void {
    this.totalWorkoutsEl.textContent = '0';
    this.totalTimeEl.textContent = '0h';
    this.mostActiveDayEl.textContent = '-';
  }
}
