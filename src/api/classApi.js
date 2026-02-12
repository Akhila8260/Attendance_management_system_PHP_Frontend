import axios from "./axios";

export const getClasses = (page = 1, search = "", limit = 10) =>
  axios.get(`/admin/classes?page=${page}&search=${search}&limit=${limit}`);

export const createClass = (data) =>
  axios.post("/admin/classes", data);

export const updateClass = (id, data) =>
  axios.put(`/admin/classes/${id}`, data);

export const deleteClass = (id) =>
  axios.delete(`/admin/classes/${id}`);
