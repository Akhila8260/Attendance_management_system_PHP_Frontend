import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getStudents,
  createStudent,
  deleteStudent,
  toggleStudentStatus,
} from "../../api/adminStudentApi";
import { getClasses } from "../../api/classApi";
import Modal from "../../components/common/Modal";
import Pagination from "../../components/common/Pagination";
import Loader from "../../components/common/Loader";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [pageData, setPageData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    class_id: "",
  });

  // ================= FETCH STUDENTS =================
  const fetchStudents = async (page = 1) => {
    try {
      setLoading(true);
      const res = await getStudents(page, search, limit);
      setStudents(res.data.data);
      setPageData(res.data);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch students", "error");
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH CLASSES =================
  const fetchClasses = async () => {
    try {
      const res = await getClasses(1, "", 100);
      setClasses(res.data.data);
    } catch (error) {
      console.error("Failed to fetch classes");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, limit]);

  useEffect(() => {
    fetchClasses();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Student?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      try {
        await deleteStudent(id);
        fetchStudents(pageData.current_page);
      } catch (error) {
        Swal.fire(
          "Error",
          error.response?.data?.message || "Delete failed",
          "error"
        );
      }
    }
  };

  // ================= TOGGLE STATUS =================
  const handleStatusToggle = async (id) => {
    try {
      await toggleStudentStatus(id);
      fetchStudents(pageData.current_page);
    } catch (error) {
      Swal.fire("Error", "Status update failed", "error");
    }
  };

  // ================= VALIDATION =================
  const validateForm = () => {
    let errors = [];

    if (!/^[A-Za-z ]{3,}$/.test(form.name))
      errors.push("Name must be at least 3 letters");

    if (!/^\S+@\S+\.\S+$/.test(form.email))
      errors.push("Valid email is required");

    if (form.mobile && !/^[6-9]\d{9}$/.test(form.mobile))
      errors.push("Valid 10 digit mobile number required");

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

    try {
      const res = await createStudent({
        ...form,
        class_id: form.class_id || null,
      });

      Swal.fire({
        icon: "success",
        title: "Student Created",
        html: `
          <p><b>Student ID:</b> ${res.data.student_id}</p>
          <p><b>Password:</b> ${res.data.password}</p>
        `,
      });

      setShowModal(false);
      setForm({
        name: "",
        email: "",
        mobile: "",
        class_id: "",
      });

      fetchStudents();
    } catch (error) {
      if (error.response?.data?.errors) {
        const backendErrors = Object.values(error.response.data.errors)
          .flat()
          .map((e) => `<p>• ${e}</p>`)
          .join("");

        Swal.fire({
          icon: "error",
          title: "Validation Failed",
          html: backendErrors,
        });
      } else {
        Swal.fire(
          "Error",
          error.response?.data?.message || "Something went wrong",
          "error"
        );
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Students</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
        >
          + Add Student
        </button>
      </div>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search student..."
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
                  <th className="p-3">Student ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Mobile</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student, index) => (
                  <tr key={student.id} className="border-t">
                    <td className="p-3">
                      {(pageData.current_page - 1) *
                        pageData.per_page +
                        index +
                        1}
                    </td>
                    <td className="p-3">{student.student_id}</td>
                    <td className="p-3">{student.name}</td>
                    <td className="p-3">{student.email}</td>
                    <td className="p-3">{student.mobile}</td>
                    <td className="p-3">
                      {student.class?.name || "N/A"}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          student.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() =>
                          handleStatusToggle(student.id)
                        }
                        className={`px-3 py-1 text-xs rounded-lg ${
                          student.status === "active"
                            ? "bg-yellow-500 text-white"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        {student.status === "active"
                          ? "Inactive"
                          : "Active"}
                      </button>

                      <button
                        disabled={student.status === "active"}
                        onClick={() =>
                          handleDelete(student.id)
                        }
                        className={`px-3 py-1 text-xs rounded-lg ${
                          student.status === "active"
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
            onPageChange={(page) => fetchStudents(page)}
          />
        </>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Add Student</h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border px-4 py-2 rounded-lg"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border px-4 py-2 rounded-lg"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Mobile"
            className="w-full border px-4 py-2 rounded-lg"
            value={form.mobile}
            onChange={(e) =>
              setForm({ ...form, mobile: e.target.value })
            }
          />

          <select
            className="w-full border px-4 py-2 rounded-lg"
            value={form.class_id}
            onChange={(e) =>
              setForm({ ...form, class_id: e.target.value })
            }
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>

          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg w-full">
            Create Student
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Students;
