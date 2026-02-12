import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../../api/dashboardApi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  const COLORS = ["#16a34a", "#f59e0b", "#dc2626"];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getDashboardStats();
      setData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!data) return <div>Loading...</div>;

  return (
    <>
      {/* Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card title="Total Students" value={data.cards.students} />
        <Card title="Teachers" value={data.cards.teachers} />
        <Card title="Classes" value={data.cards.classes} />
        <Card title="Pending Leaves" value={data.cards.pendingLeaves} highlight />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-xl font-semibold mb-4">
            Weekly Attendance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.weeklyAttendance}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="attendance" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-xl font-semibold mb-4">
            Leave Analytics
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.leaveAnalytics}
                dataKey="value"
                outerRadius={100}
                label
              >
                {data.leaveAnalytics.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-6">
        <ActionCard
          title="Leave Applications"
          description="Review teacher leave requests"
          onClick={() => navigate("/admin/leave-applications")}
        />
        <ActionCard
          title="Today's Attendance"
          description="View attendance summary"
          onClick={() => navigate("/admin/today-attendance")}
        />
      </div>
    </>
  );
};

const Card = ({ title, value, highlight }) => (
  <div
    className={`p-6 rounded-2xl shadow transition hover:shadow-lg ${
      highlight ? "bg-yellow-100" : "bg-white"
    }`}
  >
    <h3 className="text-gray-500">{title}</h3>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

const ActionCard = ({ title, description, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white p-6 rounded-2xl shadow cursor-pointer hover:shadow-lg transition"
  >
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-gray-500 mt-2">{description}</p>
  </div>
);

export default Dashboard;
