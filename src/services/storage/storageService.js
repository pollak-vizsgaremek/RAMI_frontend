// services/storageService.js

const KEYS = {
  ACCESS_TOKEN: "accessToken",
  USER: "user",
};

// ─── Token ────────────────────────────────────────────────────────────────────

export const setToken = (token) => {
  localStorage.setItem(KEYS.ACCESS_TOKEN, token);
};

export const getToken = () => {
  return (
    localStorage.getItem(KEYS.ACCESS_TOKEN) || sessionStorage.getItem("token")
  );
};

export const clearToken = () => {
  localStorage.removeItem(KEYS.ACCESS_TOKEN);
};

// ─── User ─────────────────────────────────────────────────────────────────────

export const setStoredUser = (user) => {
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
};

export const getStoredUser = () => {
  try {
    const user = localStorage.getItem(KEYS.USER);
    if (user) return JSON.parse(user);
  } catch (e) {
    console.error("Error parsing stored user from localStorage:", e);
  }

  // Fallback: check sessionStorage and construct user object from it
  const token = sessionStorage.getItem("token");
  if (token) {
    const userId = sessionStorage.getItem("userId");
    const userName = sessionStorage.getItem("userName");
    const userEmail = sessionStorage.getItem("userEmail");
    const userRole = sessionStorage.getItem("userRole") || "student";

    // Only return if we have at least a userId
    if (userId) {
      return {
        id: userId,
        name: userName || userEmail || "User",
        email: userEmail || "",
        role: userRole,
      };
    }
  } // <-- This closing brace was missing

  return null;
};

export const clearStoredUser = () => {
  localStorage.removeItem(KEYS.USER);
};

// ─── Clear everything (on logout) ────────────────────────────────────────────

export const clearAll = () => {
  clearToken();
  clearStoredUser();
};
