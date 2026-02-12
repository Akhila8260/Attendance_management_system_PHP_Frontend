import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getTeachers,
  createTeacher,
  deleteTeacher,
  toggleTeacherStatus,
} from "../../api/teacherApi";
import Modal from "../../components/common/Modal";
import Pagination from "../../components/common/Pagination";
import Loader from "../../components/common/Loader";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [pageData, setPageData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    qualification: "",
    experience_years: "",
    joining_date: "",
  });

  // ================= FETCH =================
  const fetchTeachers = async (page = 1) => {
    try {
      setLoading(true);
      const res = await getTeachers(page, search, limit);
      setTeachers(res.data.data);
      setPageData(res.data);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch teachers", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [search, limit]);

  // ================= DELETE =================
  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Teacher?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteTeacher(id);
        fetchTeachers(pageData.current_page);
      }
    });
  };

  // ================= TOGGLE STATUS =================
  const handleStatusToggle = async (id) => {
    await toggleTeacherStatus(id);
    fetchTeachers(pageData.current_page);
  };

  // ================= VALIDATION =================
  const validateForm = () => {
    let errors = [];

    if (!/^[A-Za-z ]{3,}$/.test(form.name))
      errors.push("Name must be at least 3 letters (alphabets only)");

    if (!/^\S+@\S+\.\S+$/.test(form.email))
      errors.push("Valid email is required");

    if (!/^[6-9]\d{9}$/.test(form.phone))
      errors.push("Valid 10 digit Indian phone number required");

    if (!form.gender) errors.push("Gender is required");
    if (!form.qualification) errors.push("Qualification is required");
    if (!form.experience_years || form.experience_years < 0)
      errors.push("Experience is required");
    if (!form.joining_date)
      errors.push("Joining date is required");

    return errors;
  };

  // ================= CREATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();

    if (errors.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Validation Errors",
        html: errors.map((e) => `<p>• ${e}</p>`).join(""),
      });
      return;
    }

    const res = await createTeacher({
      ...form,
      experience_years: Number(form.experience_years),
    });

    Swal.fire({
      icon: "success",
      title: "Teacher Created",
      html: `
        <p><b>Login ID:</b> ${res.data.login_id}</p>
        <p><b>Password:</b> ${res.data.temp_password}</p>
      `,
    });

    setShowModal(false);
    setForm({
      name: "",
      email: "",
      phone: "",
      gender: "",
      qualification: "",
      experience_years: "",
      joining_date: "",
    });

    fetchTeachers();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Teachers</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
        >
          + Add Teacher
        </button>
      </div>

      {/* SEARCH + LIMIT */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search teacher..."
          className="border px-4 py-2 rounded-lg w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded-lg"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="50">50</option>
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border rounded-xl">
              <thead className="bg-slate-100 text-sm">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Code</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Experience</th>
                  <th className="p-3">Joining Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {teachers.map((teacher, index) => (
                  <tr key={teacher.id} className="border-t">
                    <td className="p-3">
                      {(pageData.current_page - 1) *
                        pageData.per_page +
                        index +
                        1}
                    </td>
                    <td className="p-3">{teacher.teacher_code}</td>
                    <td className="p-3">{teacher.name}</td>
                    <td className="p-3">{teacher.email}</td>
                    <td className="p-3">{teacher.phone}</td>
                    <td className="p-3">
                      {teacher.experience_years} yrs
                    </td>
                    <td className="p-3">
                      {new Date(
                        teacher.joining_date
                      ).toLocaleDateString()}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          teacher.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {teacher.status}
                      </span>
                    </td>

                    {/* UPDATED ACTION COLUMN */}
                    <td className="p-3 flex gap-2">

                      {/* STATUS BUTTON */}
                      <button
                        onClick={() =>
                          handleStatusToggle(teacher.id)
                        }
                        className={`px-3 py-1 text-xs rounded-lg ${
                          teacher.status === "active"
                            ? "bg-yellow-500 text-white"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        {teacher.status === "active"
                          ? "Inactive"
                          : "Active"}
                      </button>

                      {/* DELETE BUTTON (Always Visible) */}
                      <button
                        disabled={teacher.status === "active"}
                        onClick={() =>
                          handleDelete(teacher.id)
                        }
                        className={`px-3 py-1 text-xs rounded-lg ${
                          teacher.status === "active"
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        Delete
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={pageData.current_page}
            totalPages={pageData.last_page}
            onPageChange={(page) => fetchTeachers(page)}
          />
        </>
      )}

      {/* MODAL */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">
            Add Teacher
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Full Name" className="w-full border px-4 py-2 rounded-lg" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} />
          <input type="email" placeholder="Email" className="w-full border px-4 py-2 rounded-lg" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} />
          <input type="text" placeholder="Phone" className="w-full border px-4 py-2 rounded-lg" value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} />
          <select className="w-full border px-4 py-2 rounded-lg" value={form.gender} onChange={(e)=>setForm({...form,gender:e.target.value})}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input type="text" placeholder="Qualification" className="w-full border px-4 py-2 rounded-lg" value={form.qualification} onChange={(e)=>setForm({...form,qualification:e.target.value})} />
          <input type="number" placeholder="Experience (Years)" className="w-full border px-4 py-2 rounded-lg" value={form.experience_years} onChange={(e)=>setForm({...form,experience_years:e.target.value})} />
          <label className="text-sm text-gray-600">Add Joining Date</label>
          <input type="date" className="w-full border px-4 py-2 rounded-lg" value={form.joining_date} onChange={(e)=>setForm({...form,joining_date:e.target.value})} />

          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg w-full">
            Create Teacher
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Teachers;
