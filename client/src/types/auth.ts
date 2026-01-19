/**
 * Shape of the data required to log in.
 */
export interface LoginCredentials {
  username: string;
  password?: string;
}

/**
 * Shape of the response returned by your /auth/login endpoint.
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

/**
 * Shape of the user stored in your AuthContext and LocalStorage.
 */
export interface AuthUser {
  userUuid: string;
  username: string;
  fullName: string;
  role: "ADMIN" | "SUPER_ADMIN" | "MEMBER"; // Added underscore to match Guard logic
}
