import { api } from "./authService.js";

// ─── USERS MANAGEMENT ──────────────────────────────────────────────────────
export const getUsersList = async (filters = {}) => {
  try {
    const response = await api.get(`/admin/users`, {
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

export const updateUser = async (userId, updateData) => {
  try {
    const response = await api.put(`/admin/users/${userId}`, updateData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update user");
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete user");
  }
};

export const banUser = async (userId, reason = "") => {
  try {
    const response = await api.post(`/admin/users/${userId}/ban`, { reason });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to ban user");
  }
};

// ─── INSTRUCTORS MANAGEMENT ────────────────────────────────────────────────
export const getInstructorsList = async (filters = {}) => {
  try {
    const response = await api.get(`/admin/instructors`, {
      params: filters,
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
    const response = await api.post(
      `/admin/instructors/${instructorId}/approve`,
      {},
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
    const response = await api.post(
      `/admin/instructors/${instructorId}/reject`,
      { reason },
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
    const response = await api.delete(`/admin/instructors/${instructorId}`);
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
    const response = await api.get(`/admin/reviews`, {
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch reviews");
  }
};

export const approveReview = async (reviewId) => {
  try {
    const response = await api.post(`/admin/reviews/${reviewId}/approve`, {});
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to approve review",
    );
  }
};

export const rejectReview = async (reviewId, reason = "") => {
  try {
    const response = await api.post(`/admin/reviews/${reviewId}/reject`, {
      reason,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to reject review");
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const response = await api.delete(`/admin/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete review");
  }
};

// ─── REPORTS MANAGEMENT ────────────────────────────────────────────────────
export const getReportsList = async (filters = {}) => {
  try {
    const response = await api.get(`/admin/reports`, {
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch reports");
  }
};

export const resolveReport = async (reportId, action, reason = "") => {
  try {
    const response = await api.post(`/admin/reports/${reportId}/resolve`, {
      action,
      reason,
    });
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
    const response = await api.get(`/admin/settings`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch settings",
    );
  }
};

export const updateSystemSettings = async (settings) => {
  try {
    const response = await api.put(`/admin/settings`, settings);
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
    const response = await api.get(`/admin/analytics`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch analytics",
    );
  }
};

// ─── SCHOOLS MANAGEMENT ────────────────────────────────────────────────────
export const getSchoolsList = async () => {
  try {
    const response = await api.get(`/school`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch schools");
  }
};

export const getSchoolById = async (schoolId) => {
  try {
    const response = await api.get(`/school/${schoolId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch school details");
  }
};

export const registerSchool = async (schoolData) => {
  try {
    const response = await api.post(`/school/register`, schoolData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.response?.data?.errors?.join(', ') || "Failed to create school");
  }
};

export const updateSchool = async (schoolId, updateData) => {
  try {
    const response = await api.put(`/school/${schoolId}`, updateData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.response?.data?.errors?.join(', ') || "Failed to update school");
  }
};

export const deleteSchool = async (schoolId) => {
  try {
    const response = await api.delete(`/school/${schoolId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to delete school");
  }
};
