/**
 * Timeline Component
 * Container for workout timeline
 */

import { Workout } from '@/shared/types/Workout.types';

/**
 * Timeline component for managing the workout timeline container
 */
export class TimelineComponent {
  private container: HTMLElement;
  private timeline: HTMLElement;
  private noDataEl: HTMLElement;
  private errorEl: HTMLElement;
  private errorMessageEl: HTMLElement;
  private errorRetryButton: HTMLElement;

  constructor(
    containerId: string = 'timeline-container',
    timelineId: string = 'timeline',
    noDataId: string = 'no-data',
    errorId: string = 'error',
    errorMessageId: string = 'error-message',
    errorRetryButtonId: string = 'error-retry-button'
  ) {
    const container = document.getElementById(containerId);
    const timeline = document.getElementById(timelineId);
    const noDataEl = document.getElementById(noDataId);
    const errorEl = document.getElementById(errorId);
    const errorMessageEl = document.getElementById(errorMessageId);
    const errorRetryButton = document.getElementById(errorRetryButtonId);

    if (
      !container ||
      !timeline ||
      !noDataEl ||
      !errorEl ||
      !errorMessageEl ||
      !errorRetryButton
    ) {
      throw new Error('Timeline elements not found');
    }

    this.container = container;
    this.timeline = timeline;
    this.noDataEl = noDataEl;
    this.errorEl = errorEl;
    this.errorMessageEl = errorMessageEl;
    this.errorRetryButton = errorRetryButton;
  }

  /**
   * Render workouts in timeline
   */
  render(content: HTMLElement): void {
    // Clear timeline
    this.timeline.innerHTML = '';

    // Add content
    this.timeline.appendChild(content);

    // Show timeline
    this.showTimeline();
  }

  /**
   * Clear timeline
   */
  clear(): void {
    this.timeline.innerHTML = '';
  }

  /**
   * Show timeline
   */
  showTimeline(): void {
    this.container.style.display = 'block';
    this.noDataEl.style.display = 'none';
    this.errorEl.style.display = 'none';
  }

  /**
   * Show no data message
   */
  showNoData(): void {
    this.container.style.display = 'none';
    this.noDataEl.style.display = 'block';
    this.errorEl.style.display = 'none';
  }

  /**
   * Show error message
   */
  showError(message: string, showRetryButton: boolean = true): void {
    this.errorMessageEl.textContent = message;
    this.errorRetryButton.style.display = showRetryButton ? 'block' : 'none';
    this.errorEl.style.display = 'block';
    this.container.style.display = 'none';
    this.noDataEl.style.display = 'none';
  }

  /**
   * Hide all sections
   */
  hideAll(): void {
    this.container.style.display = 'none';
    this.noDataEl.style.display = 'none';
    this.errorEl.style.display = 'none';
  }

  /**
   * Set retry button click handler
   */
  setRetryHandler(handler: () => void): void {
    this.errorRetryButton.onclick = handler;
  }
}
