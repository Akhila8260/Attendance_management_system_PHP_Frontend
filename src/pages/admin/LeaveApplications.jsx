const LeaveApplications = () => {
  const leaves = [
    {
      id: 1,
      teacher: "John Doe",
      from: "2026-02-15",
      to: "2026-02-18",
      reason: "Medical Leave",
      status: "Pending",
    },
  ];

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
              <td className="p-3">{leave.teacher}</td>
              <td className="p-3">{leave.from}</td>
              <td className="p-3">{leave.to}</td>
              <td className="p-3">{leave.reason}</td>
              <td className="p-3">{leave.status}</td>
              <td className="p-3 space-x-2">
                <button className="bg-green-500 text-white px-3 py-1 rounded">
                  Approve
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded">
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
