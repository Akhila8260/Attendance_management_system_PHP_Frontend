import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getNotices,
  createNotice,
  updateNotice,
  deleteNotice,
} from "../../api/noticeApi";
import Modal from "../../components/common/Modal";
import Pagination from "../../components/common/Pagination";
import Loader from "../../components/common/Loader";

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [pageData, setPageData] = useState({});
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    audience: "student",
  });

  // ==========================
  // Fetch Notices
  // ==========================
  const fetchNotices = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getNotices(page);
      setNotices(res.data.data);
      setPageData(res.data);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to fetch notices", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // ==========================
  // Handle Input Change
  // ==========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================
  // Submit Form
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await updateNotice(editId, formData);
        Swal.fire("Success", "Notice updated successfully", "success");
      } else {
        await createNotice(formData);
        Swal.fire("Success", "Notice created successfully", "success");
      }

      setIsModalOpen(false);
      setEditId(null);
      setFormData({
        title: "",
        description: "",
        audience: "student",
      });

      fetchNotices();
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  // ==========================
  // Edit
  // ==========================
  const handleEdit = (notice) => {
    setEditId(notice.id);
    setFormData({
      title: notice.title,
      description: notice.description,
      audience: notice.audience,
    });
    setIsModalOpen(true);
  };

  // ==========================
  // Delete
  // ==========================
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This notice will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
    });

    if (confirm.isConfirmed) {
      await deleteNotice(id);
      Swal.fire("Deleted!", "Notice deleted successfully", "success");
      fetchNotices();
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Notices</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Notice
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white shadow rounded">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Description</th>
                <th className="p-3">Audience</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((notice) => (
                <tr key={notice.id} className="border-t">
                  <td className="p-3">{notice.title}</td>
                  <td className="p-3 truncate max-w-xs">
                    {notice.description}
                  </td>
                  <td className="p-3 capitalize">{notice.audience}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleEdit(notice)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(notice.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination pageData={pageData} onPageChange={fetchNotices} />
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">
          {editId ? "Edit Notice" : "Add Notice"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Notice Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <textarea
            name="description"
            placeholder="Notice Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows="4"
            required
          />

          <select
            name="audience"
            value={formData.audience}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="all">All</option>
          </select>

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded w-full"
          >
            {editId ? "Update Notice" : "Create Notice"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Notice;
