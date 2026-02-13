import { Outlet } from "react-router-dom";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";

const TeacherLayout = () => {
  const links = [
    { label: "Dashboard", path: "/teacher/dashboard" },
    { label: "Profile", path: "/teacher/profile" },
    { label: "Attendance", path: "/teacher/attendance" },
    { label: "Leaves", path: "/teacher/leaves" },
    // { label: "Timetable", path: "/teacher/timetable" },
    { label: "Notices", path: "/teacher/notices" },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar links={links} open={true} />

      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6 bg-gray-100 min-h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default TeacherLayout;
