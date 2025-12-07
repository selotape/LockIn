/**
 * Workout Item Component
 * Renders individual workout items
 */

import { Workout } from '@/shared/types/Workout.types';
import { formatDuration } from '@/frontend/utils/duration-formatter';
import { formatTime } from '@/frontend/utils/date-formatter';
import { getWorkoutIcon } from '@/frontend/utils/icon-mapper';

/**
 * Workout item component for rendering individual workouts
 */
export class WorkoutItemComponent {
  /**
   * Create a workout item DOM element
   */
  static create(workout: Workout): HTMLElement {
    const startTime = new Date(workout.startTime);
    const duration = formatDuration(workout.duration);
    const time = formatTime(startTime);
    const icon = getWorkoutIcon(workout.name);

    const item = document.createElement('div');
    item.className = 'workout-item';

    item.innerHTML = `
      <div class="workout-icon">${icon}</div>
      <div class="workout-details">
        <div class="workout-name">${workout.name}</div>
        <div class="workout-time">${time}</div>
        <div class="workout-duration">${duration}</div>
        ${workout.description ? `<div class="workout-description">${workout.description}</div>` : ''}
      </div>
      <div class="workout-app">${workout.application}</div>
    `;

    return item;
  }
}
