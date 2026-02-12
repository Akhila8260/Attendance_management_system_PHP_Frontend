import api from "./axios";

/*
|--------------------------------------------------------------------------
| ADMIN STUDENT CRUD
|--------------------------------------------------------------------------
*/

export const getStudents = (page = 1, search = "", limit = 10) => {
  return api.get(
    `/admin/students?page=${page}&search=${search}&limit=${limit}`
  );
};

export const createStudent = (data) => {
  return api.post("/admin/students", data);
};

export const deleteStudent = (id) => {
  return api.delete(`/admin/students/${id}`);
};

export const toggleStudentStatus = (id) => {
  return api.patch(`/admin/students/${id}/toggle-status`);
};
