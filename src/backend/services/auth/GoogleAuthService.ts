/**
 * Google Authentication service implementation
 * Real implementation that validates tokens with Google OAuth2
 */

import { google } from 'googleapis';
import { IAuthService } from '../interfaces/IAuthService';
import { User } from '@/shared/types/User.types';

/**
 * Google OAuth2 authentication service
 */
export class GoogleAuthService implements IAuthService {
  /**
   * Validate an OAuth2 access token
   * @param accessToken - OAuth2 access token to validate
   * @returns Promise resolving to true if valid
   */
  async validateToken(accessToken: string): Promise<boolean> {
    try {
      // Basic validation: check if token is non-empty
      if (!accessToken || accessToken.trim() === '') {
        return false;
      }

      // Set up OAuth2 client with the access token
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: accessToken });

      // Try to get user info as a way to validate the token
      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
      await oauth2.userinfo.get();

      return true;
    } catch (error: any) {
      console.error('Token validation failed:', error.message);
      return false;
    }
  }

  /**
   * Get user information from an access token
   * @param accessToken - OAuth2 access token
   * @returns Promise resolving to user info, or null if invalid
   */
  async getUserInfo(accessToken: string): Promise<User | null> {
    try {
      // Set up OAuth2 client with the access token
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: accessToken });

      // Get user info from Google
      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
      const response = await oauth2.userinfo.get();

      const userInfo = response.data;

      if (!userInfo || !userInfo.id) {
        return null;
      }

      return {
        id: userInfo.id,
        email: userInfo.email || '',
        name: userInfo.name || '',
        picture: userInfo.picture,
      };
    } catch (error: any) {
      console.error('Failed to get user info:', error.message);
      return null;
    }
  }
}
