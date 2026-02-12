import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import ResetPassword from "../pages/auth/ResetPassword";

/* Layouts */
import AdminLayout from "../components/layouts/AdminLayout";
import TeacherLayout from "../components/layouts/TeacherLayout";
import StudentLayout from "../components/layouts/StudentLayout";

/* Admin Pages */
import AdminDashboard from "../pages/admin/Dashboard";
import Teachers from "../pages/admin/Teachers";
import Students from "../pages/admin/Students";
import Classes from "../pages/admin/Classes";
import Subjects from "../pages/admin/Subjects";
import AdminNotices from "../pages/admin/Notices"; // ✅ renamed
import Reports from "../pages/admin/Reports";
import LeaveApplications from "../pages/admin/LeaveApplications";
import TodayAttendance from "../pages/admin/TodayAttendance";

/* Teacher Pages */
import TeacherDashboard from "../pages/teacher/Dashboard";
import TeacherProfile from "../pages/teacher/Profile";
import TeacherAttendance from "../pages/teacher/Attendance";
import TeacherLeaves from "../pages/teacher/Leaves";
import TakeAttendance from "../pages/teacher/TakeAttendance";
import ViewAttendance from "../pages/teacher/ViewAttendance";
import Timetable from "../pages/teacher/Timetable";
import TeacherNotices from "../pages/teacher/Notices"; // ✅ renamed

/* Student Pages */
import StudentDashboard from "../pages/student/Dashboard";
import StudentProfile from "../pages/student/Profile";
import StudentAttendance from "../pages/student/Attendance";
import StudentLeaves from "../pages/student/Leaves";

/* Guards */
import AdminRoute from "../guards/AdminRoute";
import TeacherRoute from "../guards/TeacherRoute";
import StudentRoute from "../guards/StudentRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* ================= ADMIN ================= */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="students" element={<Students />} />
          <Route path="classes" element={<Classes />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="notices" element={<AdminNotices />} /> {/* ✅ */}
          <Route path="reports" element={<Reports />} />
          <Route path="leave-applications" element={<LeaveApplications />} />
          <Route path="today-attendance" element={<TodayAttendance />} />
        </Route>
      </Route>

      {/* ================= TEACHER ================= */}
      <Route element={<TeacherRoute />}>
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<TeacherDashboard />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="profile" element={<TeacherProfile />} />

          <Route path="attendance" element={<TeacherAttendance />} />
          <Route path="attendance/take" element={<TakeAttendance />} />
          <Route path="attendance/view" element={<ViewAttendance />} />

          <Route path="leaves" element={<TeacherLeaves />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="notices" element={<TeacherNotices />} /> {/* ✅ */}
        </Route>
      </Route>

      {/* ================= STUDENT ================= */}
      <Route element={<StudentRoute />}>
        <Route path="/student" element={<StudentLayout />}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="leaves" element={<StudentLeaves />} />
          <Route path="timetable" element={<Timetable />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
