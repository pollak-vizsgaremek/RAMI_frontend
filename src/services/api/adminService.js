import axios from "axios";

// Configure base URL for your API
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3300/api/v1";

// ─── USERS MANAGEMENT ──────────────────────────────────────────────────────
export const getUsersList = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/admin/users`, {
      params: filters,
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

export const updateUser = async (userId, updateData) => {
  try {
    const response = await axios.put(
      `${API_URL}/admin/users/${userId}`,
      updateData,
      {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update user");
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_URL}/admin/users/${userId}`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete user");
  }
};

export const banUser = async (userId, reason = "") => {
  try {
    const response = await axios.post(
      `${API_URL}/admin/users/${userId}/ban`,
      { reason },
      {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to ban user");
  }
};

// ─── INSTRUCTORS MANAGEMENT ────────────────────────────────────────────────
export const getInstructorsList = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/admin/instructors`, {
      params: filters,
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch instructors",
    );
  }
};

export const approveInstructor = async (instructorId) => {
  try {
    const response = await axios.post(
      `${API_URL}/admin/instructors/${instructorId}/approve`,
      {},
      {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to approve instructor",
    );
  }
};

export const rejectInstructor = async (instructorId, reason = "") => {
  try {
    const response = await axios.post(
      `${API_URL}/admin/instructors/${instructorId}/reject`,
      { reason },
      {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to reject instructor",
    );
  }
};

export const deleteInstructor = async (instructorId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/admin/instructors/${instructorId}`,
      {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete instructor",
    );
  }
};

// ─── REVIEWS MODERATION ────────────────────────────────────────────────────
export const getReviewsList = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/admin/reviews`, {
      params: filters,
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch reviews");
  }
};

export const approveReview = async (reviewId) => {
  try {
    const response = await axios.post(
      `${API_URL}/admin/reviews/${reviewId}/approve`,
      {},
      {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to approve review",
    );
  }
};

export const rejectReview = async (reviewId, reason = "") => {
  try {
    const response = await axios.post(
      `${API_URL}/admin/reviews/${reviewId}/reject`,
      { reason },
      {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to reject review");
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/admin/reviews/${reviewId}`,
      {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete review");
  }
};

// ─── REPORTS MANAGEMENT ────────────────────────────────────────────────────
export const getReportsList = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/admin/reports`, {
      params: filters,
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch reports");
  }
};

export const resolveReport = async (reportId, action, reason = "") => {
  try {
    const response = await axios.post(
      `${API_URL}/admin/reports/${reportId}/resolve`,
      { action, reason },
      {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to resolve report",
    );
  }
};

// ─── SYSTEM SETTINGS ────────────────────────────────────────────────────────
export const getSystemSettings = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/settings`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch settings",
    );
  }
};

export const updateSystemSettings = async (settings) => {
  try {
    const response = await axios.put(`${API_URL}/admin/settings`, settings, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update settings",
    );
  }
};

// ─── ANALYTICS ──────────────────────────────────────────────────────────────
export const getAnalytics = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/analytics`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch analytics",
    );
  }
};
