import axios from "./axiosInstance";

export const getSubjects = (page = 1) =>
  axios.get(`/admin/subjects?page=${page}`);

export const createSubject = (data) =>
  axios.post("/admin/subjects", data);

export const updateSubject = (id, data) =>
  axios.put(`/admin/subjects/${id}`, data);

export const deleteSubject = (id) =>
  axios.delete(`/admin/subjects/${id}`);
