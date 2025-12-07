/**
 * Local Storage Service
 * Real implementation using browser localStorage
 */

import { IStorageService } from '../interfaces/IStorageService';

/**
 * Real storage service using browser localStorage
 */
export class LocalStorageService implements IStorageService {
  /**
   * Get an item from localStorage
   * @param key - Storage key
   * @returns Value or null if not found
   */
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  /**
   * Set an item in localStorage
   * @param key - Storage key
   * @param value - Value to store
   */
  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }

  /**
   * Remove an item from localStorage
   * @param key - Storage key
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  /**
   * Clear all items from localStorage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}
