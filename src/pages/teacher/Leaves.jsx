import { useEffect, useState } from "react";
import api from "../../api/axios";
import Swal from "sweetalert2";

const TeacherLeaves = () => {
  const [studentLeaves, setStudentLeaves] = useState([]);
  const [myLeaves, setMyLeaves] = useState([]);
  const [form, setForm] = useState({
    from_date: "",
    to_date: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);

  /* ===========================
     FETCH STUDENT LEAVES
  =========================== */
  const fetchStudentLeaves = async () => {
    const res = await api.get("/teacher/leaves/pending");
    setStudentLeaves(res.data);
  };

  /* ===========================
     FETCH MY LEAVES
  =========================== */
  const fetchMyLeaves = async () => {
    const res = await api.get("/teacher/leave");
    setMyLeaves(res.data);
  };

  useEffect(() => {
    fetchStudentLeaves();
    fetchMyLeaves();
  }, []);

  /* ===========================
     APPLY LEAVE
  =========================== */
  const handleApplyLeave = async (e) => {
    e.preventDefault();

    try {
      await api.post("/teacher/leave", form);

      Swal.fire("Success", "Leave applied successfully", "success");

      setForm({ from_date: "", to_date: "", reason: "" });

      fetchMyLeaves();
    } catch (error) {
      Swal.fire("Error", "Failed to apply leave", "error");
    }
  };

  /* ===========================
     APPROVE STUDENT LEAVE
  =========================== */
  const handleApprove = async (id) => {
    await api.post(`/teacher/leaves/${id}/approve`);
    fetchStudentLeaves();
  };

  const handleReject = async (id) => {
    await api.post(`/teacher/leaves/${id}/reject`);
    fetchStudentLeaves();
  };

  return (
    <div className="p-6 space-y-10">

      {/* ================= APPLY LEAVE ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Apply Leave</h2>

        <form onSubmit={handleApplyLeave} className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <input
            type="date"
            value={form.from_date}
            onChange={(e) => setForm({ ...form, from_date: e.target.value })}
            className="border p-2 rounded"
            required
          />

          <input
            type="date"
            value={form.to_date}
            onChange={(e) => setForm({ ...form, to_date: e.target.value })}
            className="border p-2 rounded"
            required
          />

          <input
            type="text"
            placeholder="Reason"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            className="border p-2 rounded"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded col-span-1 md:col-span-3"
          >
            Submit Leave Request
          </button>
        </form>
      </div>

      {/* ================= MY LEAVES ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">My Leave Requests</h2>

        {myLeaves.map((leave) => (
          <div key={leave.id} className="border-b py-2 flex justify-between">
            <span>
              {leave.from_date} → {leave.to_date}
            </span>
            <span
              className={`font-semibold ${
                leave.status === "approved"
                  ? "text-green-600"
                  : leave.status === "rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {leave.status}
            </span>
          </div>
        ))}
      </div>

      {/* ================= STUDENT LEAVES ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">
          Student Leave Requests
        </h2>

        {studentLeaves.map((leave) => (
          <div key={leave.id} className="border-b py-3 flex justify-between items-center">
            <div>
              <p className="font-semibold">{leave.student?.name}</p>
              <p className="text-sm text-gray-500">
                {leave.from_date} → {leave.to_date}
              </p>
              <p className="text-sm">{leave.reason}</p>
            </div>

            <div className="space-x-2">
              <button
                onClick={() => handleApprove(leave.id)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => handleReject(leave.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default TeacherLeaves;
