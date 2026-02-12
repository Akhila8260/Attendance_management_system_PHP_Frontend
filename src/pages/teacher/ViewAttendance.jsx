import { useEffect, useState } from "react";
import api from "../../api/axios";
import Swal from "sweetalert2";

const ViewAttendance = () => {
  const [classId, setClassId] = useState("");
  const [section, setSection] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [date, setDate] = useState("");
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const classRes = await api.get("/admin/classes");
      const subjectRes = await api.get("/teacher/subjects");

      setClasses(classRes.data);
      setSubjects(subjectRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAttendance = async () => {
    if (!classId || !section || !subjectId || !date) {
      Swal.fire("Error", "Complete all filters", "error");
      return;
    }

    try {
      setLoading(true);

      const res = await api.get("/teacher/attendance/view", {
        params: { class_id: classId, section, subject_id: subjectId, date },
      });

      setRecords(res.data);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch attendance", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">View Attendance</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow">

        <select
          className="border p-2 rounded"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
        >
          <option value="">Select Class</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={section}
          onChange={(e) => setSection(e.target.value)}
        >
          <option value="">Select Section</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>

        <select
          className="border p-2 rounded"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
        >
          <option value="">Select Subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="border p-2 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <button
        onClick={fetchAttendance}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        View Attendance
      </button>

      {loading && <p>Loading...</p>}

      {records.length > 0 && (
        <div className="bg-white p-4 rounded-xl shadow">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Roll No</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td className="border p-2">{r.student.roll_no}</td>
                  <td className="border p-2">{r.student.name}</td>
                  <td
                    className={`border p-2 text-center font-semibold ${
                      r.present
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {r.present ? "Present" : "Absent"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewAttendance;
