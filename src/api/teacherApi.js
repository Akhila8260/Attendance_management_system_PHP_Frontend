import axiosInstance from "./axios";

/*
|--------------------------------------------------------------------------
| GET TEACHERS
|--------------------------------------------------------------------------
| Supports:
| - Pagination (page)
| - Search (search)
| - Page limit (limit)
|--------------------------------------------------------------------------
*/
export const getTeachers = (
  page = 1,
  search = "",
  limit = 10
) => {
  return axiosInstance.get(
    `/admin/teachers?page=${page}&search=${search}&limit=${limit}`
  );
};

/*
|--------------------------------------------------------------------------
| CREATE TEACHER
|--------------------------------------------------------------------------
*/
export const createTeacher = (data) => {
  return axiosInstance.post("/admin/teachers", data);
};

/*
|--------------------------------------------------------------------------
| DELETE TEACHER
|--------------------------------------------------------------------------
| Only works for inactive teachers (business rule)
|--------------------------------------------------------------------------
*/
export const deleteTeacher = (id) => {
  return axiosInstance.delete(`/admin/teachers/${id}`);
};

/*
|--------------------------------------------------------------------------
| TOGGLE TEACHER STATUS (Active <-> Inactive)
|--------------------------------------------------------------------------
*/
export const toggleTeacherStatus = (id) => {
  return axiosInstance.put(`/admin/teachers/${id}/toggle-status`);
};
