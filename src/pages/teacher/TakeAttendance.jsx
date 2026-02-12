import { useEffect, useState } from "react";
import api from "../../api/axios";
import Swal from "sweetalert2";

const TakeAttendance = () => {
  const [classId, setClassId] = useState("");
  const [section, setSection] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [date, setDate] = useState("");
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load Classes & Subjects
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const fetchInitialData = async () => {
        try {
          const res = await api.get("/teacher/subjects");

          setSubjects(res.data);

          // Extract unique classes from assigned subjects
          const uniqueClasses = [
            ...new Map(
              res.data.map(item => [item.class_id, item])
            ).values()
          ];

          setClasses(uniqueClasses);

        } catch (error) {
          console.error(error);
        }
      };

    } catch (error) {
      console.error(error);
    }
  };

  const fetchStudents = async () => {
    if (!classId || !section) {
      Swal.fire("Error", "Please select class & section", "error");
      return;
    }

    try {
      setLoading(true);

      const res = await api.get("/teacher/attendance/students", {
        params: { class_id: classId, section },
      });

      const formatted = res.data.map((s) => ({
        ...s,
        present: true,
      }));

      setStudents(formatted);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch students", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = (id) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, present: !s.present } : s
      )
    );
  };

  const submitAttendance = async () => {
    if (!subjectId || !date || students.length === 0) {
      Swal.fire("Error", "Complete all fields", "error");
      return;
    }

    try {
      setLoading(true);

      await api.post("/teacher/attendance/mark", {
        class_id: classId,
        section,
        subject_id: subjectId,
        date,
        students,
      });

      Swal.fire("Success", "Attendance Marked", "success");
      setStudents([]);
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Take Attendance</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow">

        <select
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
        >
          <option value="">Select Class</option>
          {classes.map((item) => (
            <option key={item.class_id} value={item.class_id}>
              {item.class_name}
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
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
        >
          <option value="">Select Subject</option>
          {subjects
            .filter(s => s.class_id == classId)   // 🔥 Important
            .map((item) => (
              <option key={item.subject_id} value={item.subject_id}>
                {item.subject_name}
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
        onClick={fetchStudents}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Fetch Students
      </button>

      {/* Student List */}
      {loading && <p>Loading...</p>}

      {students.length > 0 && (
        <div className="bg-white p-4 rounded-xl shadow">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Roll No</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Present</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="border p-2">{student.roll_no}</td>
                  <td className="border p-2">{student.name}</td>
                  <td className="border p-2 text-center">
                    <input
                      type="checkbox"
                      checked={student.present}
                      onChange={() => toggleAttendance(student.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={submitAttendance}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            Submit Attendance
          </button>
        </div>
      )}
    </div>
  );
};

export default TakeAttendance;
