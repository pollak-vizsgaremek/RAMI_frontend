// services/authService.js
import axios from "axios";
import { setToken, setStoredUser, clearAll, getToken } from "./storageService";

// ─── Axios instance ───────────────────────────────────────────────────────────

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // needed so the httpOnly refresh token cookie is sent automatically
});

// ─── Attach access token to every request ────────────────────────────────────

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Auto-refresh when access token expires ───────────────────────────────────
// If a request gets a 401 with { expired: true }, silently get a new access
// token and retry the original request. If the refresh also fails, log out.

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (
      error.response?.status === 401 &&
      error.response?.data?.expired === true &&
      !original._retry
    ) {
      if (isRefreshing) {
        // Queue up requests that came in while refresh was in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const res = await api.post("/auth/refresh");
        const newToken = res.data.accessToken;
        setToken(newToken);
        processQueue(null, newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (err) {
        processQueue(err, null);
        clearAll();
        window.dispatchEvent(new Event("auth:logout")); // AuthContext listens to this
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ─── register ─────────────────────────────────────────────────────────────────
// Receives surname + lastname from Register.jsx, joins them into `name` for DB,
// then saves the token and user that the backend sends back.

export const register = async ({ surname, lastname, email, password }) => {
  const name = `${surname.trim()} ${lastname.trim()}`;

  const res = await api.post("/auth/register", { name, email, password });

  setToken(res.data.accessToken);
  setStoredUser(res.data.user);

  return res.data; // { accessToken, user: { id, name, email } }
};

// ─── login ────────────────────────────────────────────────────────────────────
// Sends email + password, saves the token and user that comes back.

export const login = async ({ email, password }) => {
  const res = await api.post("/auth/login", { email, password });

  setToken(res.data.accessToken);
  setStoredUser(res.data.user);

  return res.data; // { accessToken, user: { id, name, email } }
};

// ─── logout ───────────────────────────────────────────────────────────────────
// Tells the backend to revoke the refresh token, then wipes local state.

export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch {
    // Wipe local state regardless of whether the server responded
  } finally {
    clearAll();
  }
};