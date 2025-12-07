/**
 * Duration Formatter Utility
 * Pure functions for formatting workout durations
 */

/**
 * Format a duration in milliseconds as "Xh Ym" or "Ym"
 * @param milliseconds - Duration in milliseconds
 * @returns Formatted duration string (e.g., "2h 30m" or "45m")
 */
export function formatDuration(milliseconds: number): string {
  const minutes = Math.floor(milliseconds / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  } else {
    return `${remainingMinutes}m`;
  }
}

/**
 * Format a duration in milliseconds as hours with decimal
 * @param milliseconds - Duration in milliseconds
 * @returns Formatted hours (e.g., "2.5h")
 */
export function formatDurationAsHours(milliseconds: number): string {
  const hours = Math.round((milliseconds / (1000 * 60 * 60)) * 10) / 10;
  return `${hours}h`;
}

/**
 * Format a duration in milliseconds as total minutes
 * @param milliseconds - Duration in milliseconds
 * @returns Formatted minutes (e.g., "150m")
 */
export function formatDurationAsMinutes(milliseconds: number): string {
  const minutes = Math.round(milliseconds / (1000 * 60));
  return `${minutes}m`;
}

/**
 * Convert milliseconds to hours (decimal)
 * @param milliseconds - Duration in milliseconds
 * @returns Hours as decimal number
 */
export function millisecondsToHours(milliseconds: number): number {
  return milliseconds / (1000 * 60 * 60);
}

/**
 * Convert milliseconds to minutes
 * @param milliseconds - Duration in milliseconds
 * @returns Minutes as number
 */
export function millisecondsToMinutes(milliseconds: number): number {
  return Math.floor(milliseconds / (1000 * 60));
}
