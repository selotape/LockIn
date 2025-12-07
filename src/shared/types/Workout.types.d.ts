/**
 * Workout data types
 * Represents a single workout session from Google Fitness API
 */
export interface Workout {
    /** Unique identifier for the workout session */
    id: string;
    /** Name of the workout (e.g., "Morning Run") */
    name: string;
    /** Google Fitness activity type code (e.g., 8 for Running) */
    activityType: number;
    /** ISO timestamp when the workout started */
    startTime: string;
    /** ISO timestamp when the workout ended */
    endTime: string;
    /** Duration in milliseconds */
    duration: number;
    /** Optional description of the workout */
    description?: string;
    /** Source application that recorded the workout */
    application: string;
}
/**
 * Aggregated workout statistics
 */
export interface WorkoutStats {
    /** Total number of workout sessions */
    totalWorkouts: number;
    /** Total time spent exercising in hours */
    totalTimeHours: number;
    /** Day of the week with most workouts (e.g., "Monday") */
    mostActiveDay: string;
    /** Count of workouts per day of the week */
    workoutsByDay: Record<string, number>;
}
/**
 * Grouped workouts by date
 */
export interface WorkoutGroup {
    /** Date string for the group (e.g., "2025-12-05") */
    date: string;
    /** Workouts for this date */
    workouts: Workout[];
    /** Number of workouts in this group */
    count: number;
}
//# sourceMappingURL=Workout.types.d.ts.map