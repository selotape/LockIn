/**
 * Google Fitness API Activity Type Mappings
 * Maps activity type codes to human-readable names
 * Extracted from functions/index.js lines 97-204
 */

export const ACTIVITY_TYPE_MAP: Record<number, string> = {
  1: 'Biking',
  7: 'Walking',
  8: 'Running',
  9: 'Aerobics',
  10: 'Badminton',
  11: 'Baseball',
  12: 'Basketball',
  13: 'Biathlon',
  14: 'Handbiking',
  15: 'Mountain biking',
  16: 'Road biking',
  17: 'Spinning',
  18: 'Stationary biking',
  19: 'Utility biking',
  20: 'Boxing',
  21: 'Calisthenics',
  22: 'Circuit training',
  23: 'Cricket',
  24: 'Dancing',
  25: 'Elliptical',
  26: 'Fencing',
  27: 'Football (American)',
  28: 'Football (Australian)',
  29: 'Football (Soccer)',
  30: 'Frisbee',
  31: 'Gardening',
  32: 'Golf',
  33: 'Gymnastics',
  34: 'Handball',
  35: 'Hiking',
  36: 'Hockey',
  37: 'Horseback riding',
  38: 'Housework',
  39: 'Ice skating',
  40: 'Jumping rope',
  41: 'Kayaking',
  42: 'Kettlebell training',
  43: 'Kickboxing',
  44: 'Kitesurfing',
  45: 'Martial arts',
  46: 'Meditation',
  47: 'Mixed martial arts',
  48: 'P90X exercises',
  49: 'Paragliding',
  50: 'Pilates',
  51: 'Polo',
  52: 'Racquetball',
  53: 'Rock climbing',
  54: 'Rowing',
  55: 'Rowing machine',
  56: 'Rugby',
  57: 'Jogging',
  58: 'Running on treadmill',
  59: 'Running (jogging)',
  60: 'Sailing',
  61: 'Scuba diving',
  62: 'Skateboarding',
  63: 'Skating',
  64: 'Cross skating',
  65: 'Indoor skating',
  66: 'Inline skating',
  67: 'Skiing',
  68: 'Back-country skiing',
  69: 'Cross-country skiing',
  70: 'Downhill skiing',
  71: 'Kite skiing',
  72: 'Roller skiing',
  73: 'Sledding',
  74: 'Sleeping',
  75: 'Snowboarding',
  76: 'Snowmobile',
  77: 'Snowshoeing',
  78: 'Squash',
  79: 'Stair climbing',
  80: 'Stair-climbing machine',
  81: 'Stand-up paddleboarding',
  82: 'Strength training',
  83: 'Surfing',
  84: 'Swimming',
  85: 'Swimming (open water)',
  86: 'Swimming (swimming pool)',
  87: 'Table tennis',
  88: 'Team sports',
  89: 'Tennis',
  90: 'Treadmill (walking)',
  91: 'Volleyball',
  92: 'Volleyball (beach)',
  93: 'Volleyball (indoor)',
  94: 'Wakeboarding',
  95: 'Walking (fitness)',
  96: 'Nording walking',
  97: 'Walking (treadmill)',
  98: 'Waterpolo',
  99: 'Weightlifting',
  100: 'Wheelchair',
  101: 'Windsurfing',
  102: 'Yoga',
  103: 'Zumba',
  108: 'Diving',
  109: 'Ergometer',
  110: 'Ice hockey',
  111: 'Indoor hockey',
  112: 'Lacrosse',
  113: 'Other',
};

/**
 * Get activity name from activity type code
 * @param activityType - Google Fitness activity type code
 * @returns Human-readable activity name
 */
export function getActivityName(activityType: number): string {
  return ACTIVITY_TYPE_MAP[activityType] || `Activity ${activityType}`;
}

/**
 * List of all known activity type codes
 */
export const ACTIVITY_TYPE_CODES = Object.keys(ACTIVITY_TYPE_MAP).map(Number);

/**
 * Total count of known activity types
 */
export const ACTIVITY_TYPE_COUNT = ACTIVITY_TYPE_CODES.length;
