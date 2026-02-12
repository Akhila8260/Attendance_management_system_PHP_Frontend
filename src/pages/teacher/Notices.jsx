import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await api.get("/teacher/notices");
      setNotices(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Notices</h1>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {notices.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
          No notices available.
        </div>
      ) : (
        <div className="grid gap-4">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="bg-white shadow rounded-lg p-5 border-l-4 border-blue-500"
            >
              <h2 className="text-lg font-semibold mb-2">
                {notice.title}
              </h2>
              <p className="text-gray-600 mb-3">
                {notice.description}
              </p>
              <p className="text-sm text-gray-400">
                {new Date(notice.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notices;
