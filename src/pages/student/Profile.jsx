import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const StudentProfile = () => {
  const [profile, setProfile] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/student/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProfile(res.data);
    } catch (error) {
      Swal.fire("Error", "Failed to load profile", "error");
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", profile.name || "");
      formData.append("mobile", profile.mobile || "");

      if (photoFile) {
        formData.append("photo", photoFile);
      }

      await axios.post(
        "http://127.0.0.1:8000/api/student/profile?_method=PUT",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire("Success", "Profile Updated Successfully", "success");
      fetchProfile();
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Update failed",
        "error"
      );
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-indigo-50 to-blue-50 min-h-screen">
      <div className="max-w-6xl mx-auto">

        {/* ===== Profile Header ===== */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 flex items-center gap-8">
          <div className="relative">
            <img
              src={
                profile.profile_photo
                  ? `http://127.0.0.1:8000/storage/${profile.profile_photo}`
                  : "https://ui-avatars.com/api/?name=" + profile.name
              }
              alt="profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 shadow-md"
            />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {profile.name}
            </h2>
            <p className="text-gray-500 mt-1">
              Student ID: {profile.student_id}
            </p>
            <p className="text-gray-500">
              {profile.email}
            </p>
            <p className="text-gray-500">
              Class: {profile.class_id} | Section: {profile.section}
            </p>
            <p className="text-gray-500 capitalize">
              Status: {profile.status}
            </p>
          </div>
        </div>

        {/* ===== Profile Form ===== */}
        <div className="bg-white rounded-3xl shadow-lg p-10">
          <h3 className="text-2xl font-semibold mb-8 text-indigo-600">
            Edit Profile Details
          </h3>

          <form
            onSubmit={handleUpdate}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={profile.name || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>

            {/* Email (readonly) */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Email
              </label>
              <input
                type="email"
                value={profile.email || ""}
                readOnly
                className="w-full px-4 py-3 border rounded-xl bg-gray-100"
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Mobile Number
              </label>
              <input
                type="text"
                name="mobile"
                value={profile.mobile || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>

            {/* Class ID (readonly) */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Class ID
              </label>
              <input
                type="text"
                value={profile.class_id || ""}
                readOnly
                className="w-full px-4 py-3 border rounded-xl bg-gray-100"
              />
            </div>

            {/* Section */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Section
              </label>
              <input
                type="text"
                value={profile.section || ""}
                readOnly
                className="w-full px-4 py-3 border rounded-xl bg-gray-100"
              />
            </div>

            {/* Photo Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Update Profile Photo
              </label>
              <input
                type="file"
                onChange={handlePhotoChange}
                className="block"
              />
            </div>

            {/* Buttons */}
            <div className="md:col-span-2 mt-4">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-md transition"
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/reset-password", { state: { role: "student" } })
                }
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-semibold shadow-md transition ml-4"
              >
                Reset Password
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default StudentProfile;
