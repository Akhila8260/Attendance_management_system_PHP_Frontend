import { useEffect, useState } from "react";
import { getStudentLeaves, applyLeave } from "../../api/studentApi";

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({
    from_date: "",
    to_date: "",
    reason: "",
  });

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    const res = await getStudentLeaves();
    setLeaves(res.data);
  };

  const handleApply = async () => {
    try {
      await applyLeave(form);

      setForm({
        from_date: "",
        to_date: "",
        reason: "",
      });

      fetchLeaves();
    } catch (error) {
      console.error(error.response?.data);
      alert("Validation failed. Check dates.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Leaves</h1>

      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <div className="mb-3">
          <label className="block mb-1">From Date</label>
          <input
            type="date"
            value={form.from_date}
            onChange={(e) =>
              setForm({ ...form, from_date: e.target.value })
            }
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1">To Date</label>
          <input
            type="date"
            value={form.to_date}
            onChange={(e) =>
              setForm({ ...form, to_date: e.target.value })
            }
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1">Reason</label>
          <textarea
            value={form.reason}
            onChange={(e) =>
              setForm({ ...form, reason: e.target.value })
            }
            className="w-full border p-2 rounded"
            placeholder="Enter leave reason"
          />
        </div>

        <button
          onClick={handleApply}
          className="bg-indigo-600 text-white px-4 py-2 mt-2 rounded"
        >
          Apply Leave
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        {leaves.map((leave) => (
          <div key={leave.id} className="border-b py-2">
            {leave.from_date} → {leave.to_date} | {leave.reason} -{" "}
            <strong>{leave.status}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaves;
