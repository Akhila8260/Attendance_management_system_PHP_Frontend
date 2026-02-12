import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const StudentRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role?.toLowerCase() !== "student") {
    return <Navigate to="/login" replace />;
  }

  // Block dashboard if first login
  if (user.is_first_login) {
    return <Navigate to="/reset-password" replace />;
  }

  return <Outlet />;
};

export default StudentRoute;
