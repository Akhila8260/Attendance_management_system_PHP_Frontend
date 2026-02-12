import axios from "./axiosInstance";

// Get paginated notices (Admin)
export const getNotices = (page = 1) =>
  axios.get(`/admin/notices?page=${page}`);

// Create notice
export const createNotice = (data) =>
  axios.post("/admin/notices", data);

// Update notice
export const updateNotice = (id, data) =>
  axios.put(`/admin/notices/${id}`, data);

// Delete notice
export const deleteNotice = (id) =>
  axios.delete(`/admin/notices/${id}`);
