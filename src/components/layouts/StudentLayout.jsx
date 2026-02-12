import { Outlet } from "react-router-dom";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";

const StudentLayout = () => {
  const links = [
    { label: "Dashboard", path: "/student/dashboard" },
    { label: "Profile", path: "/student/profile" },
    { label: "Attendance", path: "/student/attendance" },
    { label: "Leaves", path: "/student/leaves" },
    { label: "Timetable", path: "/student/timetable" },
    { label: "Notices", path: "/student/notices" },
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

export default StudentLayout;
