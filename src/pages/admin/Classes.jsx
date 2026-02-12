import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getClasses,
  createClass,
  updateClass,
  deleteClass,
} from "../../api/classApi";
import Modal from "../../components/common/Modal";
import Pagination from "../../components/common/Pagination";
import Loader from "../../components/common/Loader";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [pageData, setPageData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);

  const [form, setForm] = useState({
    name: "",
    section: "",
  });

  // ================= FETCH =================
  const fetchClasses = async (page = 1) => {
    try {
      setLoading(true);
      const res = await getClasses(page, search, limit);
      setClasses(res.data.data);
      setPageData(res.data);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch classes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [search, limit]);

  // ================= DELETE =================
  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Class?",
      text: "Class cannot be deleted if students exist",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteClass(id);
          fetchClasses(pageData.current_page);
        } catch (err) {
          Swal.fire(
            "Error",
            err.response?.data?.message || "Delete failed",
            "error"
          );
        }
      }
    });
  };

  // ================= VALIDATION =================
  const validateForm = () => {
    let errors = [];

    if (!form.name.trim()) errors.push("Class name is required");

    return errors;
  };

  // ================= CREATE / UPDATE =================
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
      if (editId) {
        await updateClass(editId, form);
        Swal.fire("Success", "Class updated", "success");
      } else {
        await createClass(form);
        Swal.fire("Success", "Class created", "success");
      }

      setShowModal(false);
      setEditId(null);
      setForm({ name: "", section: "" });
      fetchClasses();
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  // ================= EDIT =================
  const handleEdit = (cls) => {
    setEditId(cls.id);
    setForm({
      name: cls.name,
      section: cls.section || "",
    });
    setShowModal(true);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Classes</h1>

        <button
          onClick={() => {
            setEditId(null);
            setForm({ name: "", section: "" });
            setShowModal(true);
          }}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
        >
          + Add Class
        </button>
      </div>

      {/* SEARCH + LIMIT */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search class..."
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
                  <th className="p-3">Class Name</th>
                  <th className="p-3">Section</th>
                  <th className="p-3">Students</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {classes.map((cls, index) => (
                  <tr key={cls.id} className="border-t">
                    <td className="p-3">
                      {(pageData.current_page - 1) *
                        pageData.per_page +
                        index +
                        1}
                    </td>

                    <td className="p-3">{cls.name}</td>
                    <td className="p-3">{cls.section || "-"}</td>
                    <td className="p-3">{cls.students_count}</td>

                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(cls)}
                        className="bg-blue-500 text-white px-3 py-1 text-xs rounded-lg"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(cls.id)}
                        className="bg-red-500 text-white px-3 py-1 text-xs rounded-lg"
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
            onPageChange={(page) => fetchClasses(page)}
          />
        </>
      )}

      {/* MODAL */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {editId ? "Edit Class" : "Add Class"}
          </h2>
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
            placeholder="Class Name"
            className="w-full border px-4 py-2 rounded-lg"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Section (Optional)"
            className="w-full border px-4 py-2 rounded-lg"
            value={form.section}
            onChange={(e) =>
              setForm({ ...form, section: e.target.value })
            }
          />

          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg w-full">
            {editId ? "Update Class" : "Create Class"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Classes;
