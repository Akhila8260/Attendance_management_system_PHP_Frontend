const TodayAttendance = () => {
  const attendance = [
    { class: "10A", present: 28, absent: 2 },
    { class: "9B", present: 30, absent: 0 },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-2xl font-semibold mb-6">
        Today's Attendance
      </h2>

      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Class</th>
            <th className="p-3">Present</th>
            <th className="p-3">Absent</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((item, index) => (
            <tr key={index} className="border-t">
              <td className="p-3">{item.class}</td>
              <td className="p-3 text-green-600">{item.present}</td>
              <td className="p-3 text-red-600">{item.absent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TodayAttendance;
