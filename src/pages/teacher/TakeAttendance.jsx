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

  // ✅ Load Classes & Subjects on Mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [classRes, subjectRes] = await Promise.all([
        api.get("/teacher/classes"),
        api.get("/teacher/subjects-list"),
      ]);

      setClasses(classRes.data);
      setSubjects(subjectRes.data);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to load initial data", "error");
    }
  };

  // ✅ Fetch Students
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

      const formattedStudents = res.data.map((student) => ({
        ...student,
        present: true, // default present
      }));

      setStudents(formattedStudents);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch students", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle Attendance
  const toggleAttendance = (id) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id
          ? { ...student, present: !student.present }
          : student
      )
    );
  };

  // ✅ Submit Attendance
  const submitAttendance = async () => {
    if (!classId || !section || !subjectId || !date) {
      Swal.fire("Error", "Complete all fields", "error");
      return;
    }

    if (students.length === 0) {
      Swal.fire("Error", "No students found", "error");
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

      Swal.fire("Success", "Attendance marked successfully", "success");

      setStudents([]);
      setSubjectId("");
      setDate("");
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

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow">

        {/* Class Dropdown */}
        <select
          className="border p-2 rounded"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>

        {/* Section Dropdown */}
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

        {/* Subject Dropdown */}
        <select
          className="border p-2 rounded"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
        >
          <option value="">Select Subject</option>
          {subjects.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>

        {/* Date Picker */}
        <input
          type="date"
          className="border p-2 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* Fetch Students Button */}
      <button
        onClick={fetchStudents}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Fetch Students
      </button>

      {/* Loading Indicator */}
      {loading && <p>Loading...</p>}

      {/* Student List */}
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
                  <td className="border p-2">
                    {student.roll_no || student.student_id}
                  </td>
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
