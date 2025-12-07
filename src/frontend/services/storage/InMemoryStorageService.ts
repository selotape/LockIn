/**
 * In-Memory Storage Service
 * Mock implementation for local development without browser storage
 */

import { IStorageService } from '../interfaces/IStorageService';

/**
 * Mock storage service using in-memory Map
 * Data is lost when page reloads
 */
export class InMemoryStorageService implements IStorageService {
  private storage: Map<string, string> = new Map();

  /**
   * Get an item from in-memory storage
   * @param key - Storage key
   * @returns Value or null if not found
   */
  getItem(key: string): string | null {
    const value = this.storage.get(key);
    console.log(`[MOCK STORAGE] Get: ${key} = ${value || 'null'}`);
    return value || null;
  }

  /**
   * Set an item in in-memory storage
   * @param key - Storage key
   * @param value - Value to store
   */
  setItem(key: string, value: string): void {
    console.log(`[MOCK STORAGE] Set: ${key} = ${value}`);
    this.storage.set(key, value);
  }

  /**
   * Remove an item from in-memory storage
   * @param key - Storage key
   */
  removeItem(key: string): void {
    console.log(`[MOCK STORAGE] Remove: ${key}`);
    this.storage.delete(key);
  }

  /**
   * Clear all items from in-memory storage
   */
  clear(): void {
    console.log('[MOCK STORAGE] Clear all');
    this.storage.clear();
  }
}
