import { useEffect, useState } from "react";
import { getStudentNotices } from "../../api/studentApi";

const Notices = () => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    const res = await getStudentNotices();
    setNotices(res.data);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Notices</h1>

      <div className="bg-white p-6 rounded-xl shadow">
        {notices.length === 0 ? (
          <p className="text-gray-500">No notices available.</p>
        ) : (
          notices.map((notice) => (
            <div key={notice.id} className="border-b py-2">
              <h3 className="font-semibold">{notice.title}</h3>
              <p className="text-gray-600">{notice.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notices;
