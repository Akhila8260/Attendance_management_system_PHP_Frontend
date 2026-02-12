import api from "./axios";

/*
|--------------------------------------------------------------------------
| TEACHER ATTENDANCE
|--------------------------------------------------------------------------
*/

// Get students for attendance
export const getStudentsForAttendance = (class_id, section) => {
  return api.get(
    `/teacher/attendance/students?class_id=${class_id}&section=${section}`
  );
};

// Mark attendance
export const markAttendance = (data) => {
  return api.post("/teacher/attendance/mark", data);
};

// View attendance (teacher)
export const viewAttendance = (params) => {
  return api.get("/teacher/attendance/view", { params });
};


/*
|--------------------------------------------------------------------------
| STUDENT ATTENDANCE
|--------------------------------------------------------------------------
*/

// Student: Get own attendance
export const getStudentAttendance = () => {
  return api.get("/student/attendance");
};

// Attendance percentage
export const getAttendancePercentage = () => {
  return api.get("/student/attendance-percentage");
};

// Monthly report
export const getMonthlyReport = (month) => {
  return api.get(`/student/monthly-report/${month}`);
};

// Subject wise
export const getSubjectWiseAttendance = () => {
  return api.get("/student/subject-wise-attendance");
};

// Low attendance warning
export const getAttendanceWarning = () => {
  return api.get("/student/attendance-warning");
};
