// services/authService.js
import axios from "axios";
import {
  setToken,
  setStoredUser,
  clearAll,
  getToken,
} from "../storage/storageService.js";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3300/api/v1",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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
        window.dispatchEvent(new Event("auth:logout"));
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export const register = async ({ surname, lastname, email, password }) => {
  const name = `${surname.trim()} ${lastname.trim()}`;

  const res = await api.post("/auth/register", { name, email, password });

  setToken(res.data.accessToken);
  setStoredUser(res.data.user);

  return res.data; // { accessToken, user: { id, name, email } }
};

export const login = async ({ email, password }) => {
  const res = await api.post("/auth/login", { email, password });

  setToken(res.data.accessToken);
  setStoredUser(res.data.user);

  return res.data; // { accessToken, user: { id, name, email } }
};

export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch {
  } finally {
    clearAll();
  }
};
