import { useEffect, useState } from "react";
import { getStudentProfile, updateStudentProfile } from "../../api/studentApi";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    section: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await getStudentProfile();
    setProfile(res.data);
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateStudentProfile(profile);
    alert("Profile updated successfully");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="bg-white p-6 rounded-xl shadow">
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Update Profile
          </button>

        </form>
      </div>
    </div>
  );
};

export default Profile;
