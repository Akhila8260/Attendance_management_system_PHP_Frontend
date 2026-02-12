import { Outlet } from "react-router-dom";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";
import Footer from "../common/Footer"; // ✅ fixed path

const AdminLayout = () => {
  const links = [
    { label: "Dashboard", path: "/admin" },
    { label: "Teacher", path: "/admin/teachers" },
    { label: "Students", path: "/admin/students" },
    { label: "Classes", path: "/admin/classes" },
    { label: "Subjects", path: "/admin/subjects" },
    { label: "Notices", path: "/admin/notices" },
  ];

  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <Sidebar links={links} open={true} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <div className="flex-1 bg-slate-50 p-6">
          <Outlet />
        </div>

        {/* Footer */}
        <Footer />

      </div>
    </div>
  );
};

export default AdminLayout;
