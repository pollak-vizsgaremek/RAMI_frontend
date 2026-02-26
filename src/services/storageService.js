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
  return localStorage.getItem(KEYS.ACCESS_TOKEN);
};

export const clearToken = () => {
  localStorage.removeItem(KEYS.ACCESS_TOKEN);
};

// ─── User ─────────────────────────────────────────────────────────────────────

export const setStoredUser = (user) => {
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
};

export const getStoredUser = () => {
  const user = localStorage.getItem(KEYS.USER);
  return user ? JSON.parse(user) : null;
};

export const clearStoredUser = () => {
  localStorage.removeItem(KEYS.USER);
};

// ─── Clear everything (on logout) ────────────────────────────────────────────

export const clearAll = () => {
  clearToken();
  clearStoredUser();
};