import { useEffect, useState } from "react";
import { getAttendancePercentage } from "../../api/attendanceApi";
import { getStudentLeaves, getStudentNotices } from "../../api/studentApi";

const Dashboard = () => {
  const [attendance, setAttendance] = useState(0);
  const [leaves, setLeaves] = useState(0);
  const [notices, setNotices] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const attRes = await getAttendancePercentage();
      setAttendance(attRes.data.percentage);

      const leaveRes = await getStudentLeaves();
      const pending = leaveRes.data.filter(l => l.status === "pending");
      setLeaves(pending.length);

      const noticeRes = await getStudentNotices();
      setNotices(noticeRes.data.length);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">Attendance %</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">
            {attendance}%
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">Pending Leaves</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">
            {leaves}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">Notices</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">
            {notices}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
