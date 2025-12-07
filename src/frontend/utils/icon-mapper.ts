/**
 * Icon Mapper Utility
 * Pure functions for mapping activity names to emoji icons
 */

/**
 * Activity name to emoji icon mapping
 */
const ACTIVITY_ICONS: Record<string, string> = {
  Running: '🏃‍♀️',
  Walking: '🚶‍♀️',
  Biking: '🚴‍♀️',
  Swimming: '🏊‍♀️',
  Yoga: '🧘‍♀️',
  Weightlifting: '🏋️‍♀️',
  Basketball: '⛹️‍♀️',
  Tennis: '🎾',
  Golf: '⛳',
  Dancing: '💃',
  Boxing: '🥊',
  Climbing: '🧗‍♀️',
  Cycling: '🚴‍♀️',
  Hiking: '🥾',
  Skiing: '⛷️',
  Surfing: '🏄‍♀️',
};

/**
 * Default icon for unknown activities
 */
const DEFAULT_ICON = '🏃‍♀️';

/**
 * Get emoji icon for a workout activity
 * Uses case-insensitive matching
 * @param activityName - Name of the activity
 * @returns Emoji icon for the activity
 */
export function getWorkoutIcon(activityName: string): string {
  // Find matching icon (case-insensitive substring match)
  const matchingKey = Object.keys(ACTIVITY_ICONS).find((key) =>
    activityName.toLowerCase().includes(key.toLowerCase())
  );

  return matchingKey ? ACTIVITY_ICONS[matchingKey] : DEFAULT_ICON;
}

/**
 * Get emoji icon for a workout activity (exact match)
 * @param activityName - Name of the activity
 * @returns Emoji icon for the activity
 */
export function getWorkoutIconExact(activityName: string): string {
  return ACTIVITY_ICONS[activityName] || DEFAULT_ICON;
}

/**
 * Check if an activity has a mapped icon
 * @param activityName - Name of the activity
 * @returns True if activity has an icon mapping
 */
export function hasWorkoutIcon(activityName: string): boolean {
  return Object.keys(ACTIVITY_ICONS).some((key) =>
    activityName.toLowerCase().includes(key.toLowerCase())
  );
}

/**
 * Get all available activity icons
 * @returns Map of activity names to icons
 */
export function getAllActivityIcons(): Record<string, string> {
  return { ...ACTIVITY_ICONS };
}
