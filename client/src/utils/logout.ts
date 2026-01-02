export const clearAuthData = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

/**
 * Full logout: clears data and forces a page reload to the login page
 * This is safe to call from anywhere (components or api.ts)
 */
export const logout = () => {
  clearAuthData();
  // Using window.location forces a full refresh, which clears
  // any sensitive data remaining in React's memory/state.
  window.location.href = "/login";
};
