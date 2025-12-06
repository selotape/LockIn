/**
 * Activity type mapper
 * Maps Google Fitness activity type codes to human-readable names
 * Extracted from functions/index.js lines 96-205
 */

import { ACTIVITY_TYPE_MAP, getActivityName as getActivityNameFromConstants } from '@/shared/constants/activity-types';

/**
 * Get human-readable activity name from activity type code
 * @param activityType - Google Fitness activity type code
 * @returns Human-readable activity name
 */
export function getActivityName(activityType: number): string {
  return getActivityNameFromConstants(activityType);
}

/**
 * Get all known activity type codes
 * @returns Array of all known activity type codes
 */
export function getAllActivityTypeCodes(): number[] {
  return Object.keys(ACTIVITY_TYPE_MAP).map(Number);
}

/**
 * Check if an activity type code is known
 * @param activityType - Activity type code to check
 * @returns True if the activity type is known
 */
export function isKnownActivityType(activityType: number): boolean {
  return activityType in ACTIVITY_TYPE_MAP;
}

/**
 * Get activity type code from name (case-insensitive)
 * @param activityName - Activity name to search for
 * @returns Activity type code, or undefined if not found
 */
export function getActivityTypeByName(activityName: string): number | undefined {
  const normalizedName = activityName.toLowerCase().trim();

  for (const [code, name] of Object.entries(ACTIVITY_TYPE_MAP)) {
    if (name.toLowerCase() === normalizedName) {
      return parseInt(code, 10);
    }
  }

  return undefined;
}

/**
 * Get all activity names
 * @returns Array of all activity names
 */
export function getAllActivityNames(): string[] {
  return Object.values(ACTIVITY_TYPE_MAP);
}

/**
 * Get activity type map
 * @returns Complete activity type mapping
 */
export function getActivityTypeMap(): Record<number, string> {
  return { ...ACTIVITY_TYPE_MAP };
}
