import { useState, useContext } from "react";
import { loginApi } from "../../api/authApi";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    login_id: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /* ===========================
     FIELD VALIDATION
  =========================== */

  const validateField = (name, value) => {
    let error = "";

    if (name === "login_id") {
      if (!value) {
        error = "Username / Email is required";
      } else if (value.includes("@")) {
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(value)) {
          error = "Enter valid email format";
        }
      }
    }

    if (name === "password") {
      if (!value) error = "Password is required";
      else if (value.length < 6)
        error = "Password must be at least 6 characters";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    validateField(name, value);
  };

  /* ===========================
     DETECT ROLE
  =========================== */

  const detectRole = (loginId) => {
    if (loginId.includes("@")) return "admin";
    if (loginId.startsWith("TCH")) return "teacher";
    return "student";
  };

  /* ===========================
     SUBMIT LOGIN
  =========================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.login_id ||
      !form.password ||
      errors.login_id ||
      errors.password
    ) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please fix the form errors before submitting",
      });
      return;
    }

    try {
      setLoading(true);

      const roleType = detectRole(form.login_id);

      let payload = {};

      if (roleType === "admin") {
        payload = {
          email: form.login_id,
          password: form.password,
        };
      } else if (roleType === "teacher") {
        payload = {
          login_id: form.login_id,
          password: form.password,
        };
      } else {
        payload = {
          student_id: form.login_id,
          password: form.password,
        };
      }

      const response = await loginApi(payload, roleType);
      const data = response.data;

      login(data);

      await Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Redirecting...",
        timer: 1500,
        showConfirmButton: false,
      });

      const userRole = data.user.role.toLowerCase();

      // 🔥 FIRST LOGIN CHECK
      if (
        (userRole === "teacher" || userRole === "student") &&
        data.user.is_first_login
      ) {
        navigate("/reset-password", { replace: true });
        return;
      }

      // ROUTING
      const dashboardRoutes = {
        admin: "/admin",
        teacher: "/teacher/dashboard",
        student: "/student/dashboard",
      };

      navigate(dashboardRoutes[userRole], { replace: true });

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text:
          error.response?.data?.message ||
          "Invalid Username / Email or Password",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ===========================
     UI
  =========================== */

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex flex-col items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1588072432836-e10032774350')",
      }}
    >
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-wide">
          Welcome to Attendance Management System
        </h1>
        <p className="mt-3 text-lg opacity-90">
          Manage attendance efficiently for Admin, Teachers & Students.
        </p>
      </div>

      <div className="relative z-10 mt-16 w-full flex justify-center px-4">
        <div className="bg-white/95 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-lg">

          <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-8">
            Sign In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <input
                type="text"
                name="login_id"
                placeholder="Username / Email"
                value={form.login_id}
                onChange={handleChange}
                className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.login_id && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.login_id}
                </p>
              )}
            </div>

            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 cursor-pointer text-gray-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-semibold transition"
            >
              {loading ? "Signing in..." : "Login"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
