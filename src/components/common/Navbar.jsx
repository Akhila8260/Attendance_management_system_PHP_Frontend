import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();

  // Get stored data
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const role = user?.role?.toLowerCase();

  const handleLogout = async () => {
    try {
      if (!token) return;

      // 🔥 Dynamic logout endpoint
      let logoutUrl = "";

      if (role === "admin") {
        logoutUrl = "http://127.0.0.1:8000/api/admin/logout";
      } else if (role === "teacher") {
        logoutUrl = "http://127.0.0.1:8000/api/teacher/logout";
      } else if (role === "student") {
        logoutUrl = "http://127.0.0.1:8000/api/student/logout";
      }

      await axios.post(
        logoutUrl,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Clear storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login", { replace: true });

    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="flex justify-between items-center px-8 py-4 bg-white shadow-sm border-b">
      
      {/* 🔥 Dynamic Panel Title */}
      <h2 className="text-lg font-semibold text-slate-700">
        {role ? role.charAt(0).toUpperCase() + role.slice(1) : ""} Panel
      </h2>

      <div className="flex items-center gap-4">
        
        {/* 🔥 Dynamic User Name */}
        <span className="text-sm text-slate-600 font-medium">
          {user?.name}
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
