import { useEffect, useState } from "react";
import { getStudentAttendance } from "../../api/attendanceApi";

const Attendance = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await getStudentAttendance();
      setRecords(res.data.data); // because pagination
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Attendance</h1>

      <div className="bg-white p-6 rounded-xl shadow">
        {records.length === 0 ? (
          <p className="text-gray-500">No attendance records found.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th>Date</th>
                <th>Subject</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((item) => (
                <tr key={item.id} className="border-b">
                  <td>{item.date}</td>
                  <td>{item.subject?.name}</td>
                  <td>
                    {item.present ? (
                      <span className="text-green-600">Present</span>
                    ) : (
                      <span className="text-red-600">Absent</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Attendance;
