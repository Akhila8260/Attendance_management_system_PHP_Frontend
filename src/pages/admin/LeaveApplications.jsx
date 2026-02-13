import { useEffect, useState } from "react";
import api from "../../api/axios";
import Swal from "sweetalert2";

const LeaveApplications = () => {
  const [leaves, setLeaves] = useState([]);

  /* ===========================
     FETCH PENDING TEACHER LEAVES
  =========================== */
  const fetchLeaves = async () => {
    try {
      const res = await api.get("/admin/leaves/pending");
      setLeaves(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  /* ===========================
     APPROVE LEAVE
  =========================== */
  const handleApprove = async (id) => {
    try {
      await api.post(`/admin/leaves/${id}/approve`);

      Swal.fire("Success", "Leave approved successfully", "success");

      fetchLeaves(); // refresh list
    } catch (error) {
      Swal.fire("Error", "Failed to approve leave", "error");
    }
  };

  /* ===========================
     REJECT LEAVE
  =========================== */
  const handleReject = async (id) => {
    const { value: remarks } = await Swal.fire({
      title: "Reject Leave",
      input: "text",
      inputLabel: "Enter rejection reason",
      showCancelButton: true,
    });

    if (!remarks) return;

    try {
      await api.post(`/admin/leaves/${id}/reject`, {
        remarks,
      });

      Swal.fire("Rejected", "Leave rejected successfully", "success");

      fetchLeaves();
    } catch (error) {
      Swal.fire("Error", "Failed to reject leave", "error");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-2xl font-semibold mb-6">
        Teacher Leave Applications
      </h2>

      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Teacher</th>
            <th className="p-3">From</th>
            <th className="p-3">To</th>
            <th className="p-3">Reason</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave.id} className="border-t">
              <td className="p-3">{leave.teacher?.name}</td>
              <td className="p-3">{leave.from_date}</td>
              <td className="p-3">{leave.to_date}</td>
              <td className="p-3">{leave.reason}</td>

              <td
                className={`p-3 font-semibold ${leave.status?.toUpperCase() === "APPROVED"
                  ? "text-green-600"
                  : leave.status?.toUpperCase() === "REJECTED"
                    ? "text-red-600"
                    : "text-yellow-600"
                  }`}
              >
                {leave.status}
              </td>


              <td className="p-3 space-x-2">
                <button
                  onClick={() => handleApprove(leave.id)}
                  disabled={leave.status?.toUpperCase() !== "PENDING"}
                  className={`px-3 py-1 rounded text-white ${leave.status?.toUpperCase() !== "PENDING"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500"
                    }`}
                >
                  Approve
                </button>


                <button
                  onClick={() => handleReject(leave.id)}
                  disabled={leave.status?.toUpperCase() !== "PENDING"}
                  className={`px-3 py-1 rounded text-white ${leave.status?.toUpperCase() !== "PENDING"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500"
                    }`}
                >
                  Reject
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveApplications;
