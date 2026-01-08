/**
 * Shape of the data required to log in.
 */
export interface LoginCredentials {
  username: string;
  password?: string; // Optional if using different auth methods later
}

/**
 * Shape of the response returned by your /auth/login endpoint.
 * This matches your api.ts unwrapping logic.
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    uuid: string;
    username: string;
    fullName: string;
    role: "ADMIN" | "SUPERADMIN" | "MEMBER";
  };
}

/**
 * Shape of the user stored in your AuthContext.
 */
export interface AuthUser {
  uuid: string;
  username: string;
  fullName: string;
  role: string;
}
