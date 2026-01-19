import type { AuthUser } from "../types/auth";

/**
 * Checks if a user session "hint" exists in local storage.
 */
export const isTokenValid = (): boolean => {
  const userJson = localStorage.getItem("user");
  return !!userJson;
};

/**
 * Retrieves the user profile from local storage.
 * Standardized to return AuthUser (which uses userUuid).
 */
export const getUserFromToken = (): AuthUser | null => {
  const userJson = localStorage.getItem("user");
  if (!userJson) return null;

  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
};

/**
 * Specifically extracts the user identifier for the /auth/refresh call.
 */
export const getUserIdFromToken = (): string | null => {
  const user = getUserFromToken();
  return user ? user.userUuid : null;
};

/**
 * Helper to save user info to localStorage after login/refresh.
 */
export const saveUserToStorage = (user: AuthUser) => {
  localStorage.setItem("user", JSON.stringify(user));
};

/**
 * Helper to clear user info from localStorage.
 */
export const clearUserFromStorage = () => {
  localStorage.removeItem("user");
};
