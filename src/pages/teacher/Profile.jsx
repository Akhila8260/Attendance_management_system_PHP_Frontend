import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const TeacherProfile = () => {
  const [profile, setProfile] = useState({});
  const [photoFile, setPhotoFile] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await axios.get(
      "http://127.0.0.1:8000/api/teacher/profile",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setProfile(res.data);
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(profile).forEach((key) => {
      if (profile[key] !== null) {
        formData.append(key, profile[key]);
      }
    });

    if (photoFile) {
      formData.append("photo", photoFile);
    }

    await axios.post(
      "http://127.0.0.1:8000/api/teacher/profile?_method=PUT",
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
  };

  return (
    <div className="p-8 bg-gradient-to-br from-indigo-50 to-blue-50 min-h-screen">
      <div className="max-w-6xl mx-auto">

        {/* ===== Profile Header ===== */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 flex items-center gap-8">
          <div className="relative">
            <img
              src={
                profile.photo
                  ? `http://127.0.0.1:8000/storage/${profile.photo}`
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
              Teacher Code: {profile.teacher_code}
            </p>
            <p className="text-gray-500">
              {profile.email}
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

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={profile.phone || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={profile.gender || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* DOB */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={profile.dob || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>

            {/* Joining Date */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Joining Date
              </label>
              <input
                type="date"
                name="joining_date"
                value={profile.joining_date || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>

            {/* Qualification */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Qualification
              </label>
              <input
                type="text"
                name="qualification"
                value={profile.qualification || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Experience (Years)
              </label>
              <input
                type="number"
                name="experience_years"
                value={profile.experience_years || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={profile.address || ""}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
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

            {/* Submit Button */}
            <div className="md:col-span-2 mt-4">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-md transition"
              >
                Save Changes
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default TeacherProfile;
