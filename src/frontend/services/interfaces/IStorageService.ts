/**
 * Storage Service Interface
 * Abstracts key-value storage functionality
 */

/**
 * Interface for storage services
 * Implementations: LocalStorageService (browser), InMemoryStorageService (mock)
 */
export interface IStorageService {
  /**
   * Get an item from storage
   * @param key - Storage key
   * @returns Value or null if not found
   */
  getItem(key: string): string | null;

  /**
   * Set an item in storage
   * @param key - Storage key
   * @param value - Value to store
   */
  setItem(key: string, value: string): void;

  /**
   * Remove an item from storage
   * @param key - Storage key
   */
  removeItem(key: string): void;

  /**
   * Clear all items from storage
   */
  clear(): void;
}
