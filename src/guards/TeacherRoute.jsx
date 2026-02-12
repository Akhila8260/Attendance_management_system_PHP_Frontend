import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const TeacherRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role?.toLowerCase() !== "teacher") {
    return <Navigate to="/login" replace />;
  }

  // Optional: block dashboard if first login
  if (user.is_first_login) {
    return <Navigate to="/reset-password" replace />;
  }

  return <Outlet />;
};

export default TeacherRoute;
