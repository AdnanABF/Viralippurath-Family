import type { AuthUser } from "../types/auth";

/**
 * Checks if a user session "hint" exists in local storage.
 * This is used to determine if we should show a loading spinner
 * while validating the actual session cookie with the server.
 */
export const isTokenValid = (): boolean => {
  const userJson = localStorage.getItem("user");
  if (!userJson) return false;

  try {
    const user = JSON.parse(userJson);
    // Ensure the hint contains the required identifier
    return !!(user && user.userUuid);
  } catch {
    return false;
  }
};

/**
 * Retrieves the user profile from local storage.
 * Standardized to return AuthUser (which uses userUuid).
 */
export const getUserFromToken = (): AuthUser | null => {
  const userJson = localStorage.getItem("user");
  if (!userJson) return null;

  try {
    const user: AuthUser = JSON.parse(userJson);
    if (user && user.userUuid) {
      return user;
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Specifically extracts the user identifier.
 * Useful for logs or specific API calls that require the UUID.
 */
export const getUserIdFromToken = (): string | null => {
  const user = getUserFromToken();
  return user ? user.userUuid : null;
};

/**
 * Helper to save user info to localStorage after login/refresh.
 * We only save non-sensitive profile data here.
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
