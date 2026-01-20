import { clearUserFromStorage } from "./auth";

/**
 * Clears the user profile hint from local storage.
 * Note: The actual JWT cookies are cleared by the browser
 * when the server sends 'Set-Cookie' with an expired date
 * during the logout API call.
 */
export const clearAuthData = () => {
  clearUserFromStorage();
};

/**
 * Full logout: clears local hints and forces a page reload.
 * When this is called from api.ts (e.g., on a 401 error),
 * it ensures the UI resets to the login state.
 */
export const logout = () => {
  clearAuthData();

  // Force a full refresh to clear React state and redirect
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};
