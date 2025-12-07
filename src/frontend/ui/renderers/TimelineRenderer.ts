/**
 * Timeline Renderer
 * Orchestrates timeline rendering with date groups and workout items
 */

import { Workout } from '@/shared/types/Workout.types';
import { WorkoutGrouper } from '@/frontend/domain/calculators/WorkoutGrouper';
import { WorkoutItemComponent } from '@/frontend/ui/components/WorkoutItemComponent';
import { formatDate } from '@/frontend/utils/date-formatter';

/**
 * Timeline renderer for creating timeline DOM structure
 */
export class TimelineRenderer {
  /**
   * Render complete timeline with date groups
   */
  static render(workouts: Workout[]): HTMLElement {
    const fragment = document.createDocumentFragment();

    // Group workouts by date
    const grouped = WorkoutGrouper.groupByDate(workouts);

    // Create date groups
    Object.entries(grouped).forEach(([date, workouts]) => {
      const dateGroup = this.createDateGroup(date, workouts);
      fragment.appendChild(dateGroup);
    });

    // Wrap in container
    const container = document.createElement('div');
    container.appendChild(fragment);

    return container;
  }

  /**
   * Create a date group element
   */
  private static createDateGroup(
    dateString: string,
    workouts: Workout[]
  ): HTMLElement {
    const dateGroup = document.createElement('div');
    dateGroup.className = 'date-group';

    // Create date header
    const dateHeader = document.createElement('div');
    dateHeader.className = 'date-header';

    const date = new Date(dateString);
    const formattedDate = formatDate(date);
    const workoutCount = workouts.length;

    dateHeader.innerHTML = `
      <h3>${formattedDate}</h3>
      <span class="workout-count">${workoutCount} workout${workoutCount !== 1 ? 's' : ''}</span>
    `;

    // Create workouts list
    const workoutsList = document.createElement('div');
    workoutsList.className = 'workouts-list';

    // Add workout items
    workouts.forEach((workout) => {
      const workoutItem = WorkoutItemComponent.create(workout);
      workoutsList.appendChild(workoutItem);
    });

    // Assemble date group
    dateGroup.appendChild(dateHeader);
    dateGroup.appendChild(workoutsList);

    return dateGroup;
  }
}
