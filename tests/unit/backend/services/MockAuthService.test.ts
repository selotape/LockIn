/**
 * Tests for MockAuthService
 */

import { MockAuthService } from '@/backend/services/auth/MockAuthService';

describe('MockAuthService', () => {
  let service: MockAuthService;

  beforeEach(() => {
    service = new MockAuthService();
  });

  describe('validateToken', () => {
    it('should validate non-empty tokens as true', async () => {
      const result = await service.validateToken('mock-token');
      expect(result).toBe(true);
    });

    it('should validate any non-empty string as true', async () => {
      expect(await service.validateToken('test-token-123')).toBe(true);
      expect(await service.validateToken('another-token')).toBe(true);
      expect(await service.validateToken('xyz')).toBe(true);
    });

    it('should reject empty tokens', async () => {
      expect(await service.validateToken('')).toBe(false);
      expect(await service.validateToken('   ')).toBe(false);
    });
  });

  describe('getUserInfo', () => {
    it('should return mock user info for valid tokens', async () => {
      const userInfo = await service.getUserInfo('mock-token');

      expect(userInfo).not.toBeNull();
      expect(userInfo).toHaveProperty('id');
      expect(userInfo).toHaveProperty('email');
      expect(userInfo).toHaveProperty('name');
      expect(userInfo).toHaveProperty('picture');
    });

    it('should return consistent mock user data', async () => {
      const userInfo1 = await service.getUserInfo('token-1');
      const userInfo2 = await service.getUserInfo('token-2');

      expect(userInfo1).toEqual(userInfo2);
      expect(userInfo1?.id).toBe('mock-user-123');
      expect(userInfo1?.email).toBe('mockuser@example.com');
    });

    it('should return null for empty tokens', async () => {
      expect(await service.getUserInfo('')).toBeNull();
      expect(await service.getUserInfo('   ')).toBeNull();
    });

    it('should return user with all required properties', async () => {
      const userInfo = await service.getUserInfo('mock-token');

      expect(userInfo).not.toBeNull();
      if (userInfo) {
        expect(typeof userInfo.id).toBe('string');
        expect(typeof userInfo.email).toBe('string');
        expect(typeof userInfo.name).toBe('string');
        expect(userInfo.id.length).toBeGreaterThan(0);
        expect(userInfo.email.length).toBeGreaterThan(0);
        expect(userInfo.name.length).toBeGreaterThan(0);
      }
    });
  });
});
