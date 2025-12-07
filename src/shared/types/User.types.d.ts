/**
 * User and authentication types
 */
export interface User {
    /** Unique user identifier */
    id: string;
    /** User's email address */
    email: string;
    /** User's display name */
    name: string;
    /** Optional profile picture URL */
    picture?: string;
}
/**
 * Authentication credentials from Google OAuth
 */
export interface AuthCredentials {
    /** JWT ID token from Google Sign-In */
    idToken: string;
    /** OAuth2 access token for API calls */
    accessToken: string;
}
/**
 * Token information
 */
export interface TokenInfo {
    /** The access token string */
    token: string;
    /** Token expiration timestamp (Unix milliseconds) */
    expiresAt: number;
    /** Token scopes */
    scopes: string[];
}
//# sourceMappingURL=User.types.d.ts.map