import axios from "./axiosInstance";

export const getDashboardStats = () =>
  axios.get("/admin/dashboard");
