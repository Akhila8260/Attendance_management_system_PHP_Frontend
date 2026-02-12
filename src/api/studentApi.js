import api from "./axios";

/*
|--------------------------------------------------------------------------
| DASHBOARD
|--------------------------------------------------------------------------
*/

export const getStudentDashboard = () => {
  return api.get("/student/dashboard");
};

/*
|--------------------------------------------------------------------------
| PROFILE
|--------------------------------------------------------------------------
*/

export const getStudentProfile = () => {
  return api.get("/student/profile");
};

export const updateStudentProfile = (data) => {
  return api.put("/student/profile", data);
};

/*
|--------------------------------------------------------------------------
| LEAVES
|--------------------------------------------------------------------------
*/

export const getStudentLeaves = () => {
  return api.get("/student/leave");
};

export const applyLeave = (data) => {
  return api.post("/student/leave", data);
};

/*
|--------------------------------------------------------------------------
| NOTICES
|--------------------------------------------------------------------------
*/

export const getStudentNotices = () => {
  return api.get("/student/notices");
};
