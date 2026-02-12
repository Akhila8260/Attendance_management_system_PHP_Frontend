import { useNavigate } from "react-router-dom";

const Attendance = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Attendance</h2>

      <div className="flex gap-6">
        <button
          onClick={() => navigate("/teacher/attendance/take")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Take Attendance
        </button>

        <button
          onClick={() => navigate("/teacher/attendance/view")}
          className="bg-green-600 text-white px-6 py-3 rounded-lg"
        >
          View Attendance
        </button>
      </div>
    </div>
  );
};

export default Attendance;
