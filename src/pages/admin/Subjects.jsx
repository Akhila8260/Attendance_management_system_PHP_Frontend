import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} from "../../api/subjectApi";
import { getTeachers } from "../../api/teacherApi";
import { getClasses } from "../../api/classApi";
import Modal from "../../components/common/Modal";
import Pagination from "../../components/common/Pagination";
import Loader from "../../components/common/Loader";

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [pageData, setPageData] = useState({});
  const [loading, setLoading] = useState(false);

  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    teacher_id: "",
    class_id: "",
  });

  // ============================
  // FETCH SUBJECTS
  // ============================
  const fetchSubjects = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getSubjects(page);
      setSubjects(res.data.data);
      setPageData(res.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  // ============================
  // FETCH TEACHERS + CLASSES
  // ============================
  const fetchDropdownData = async () => {
    try {
      const teacherRes = await getTeachers();
      const classRes = await getClasses();

      setTeachers(teacherRes.data.data || teacherRes.data);
      setClasses(classRes.data.data || classRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchDropdownData();
  }, []);

  // ============================
  // HANDLE INPUT
  // ============================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ============================
  // SUBMIT (CREATE / UPDATE)
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.code || !formData.teacher_id || !formData.class_id) {
      Swal.fire("Error", "All fields are required", "error");
      return;
    }

    try {
      if (editId) {
        await updateSubject(editId, formData);
        Swal.fire("Success", "Subject updated successfully", "success");
      } else {
        await createSubject(formData);
        Swal.fire("Success", "Subject created successfully", "success");
      }

      setIsModalOpen(false);
      setEditId(null);
      setFormData({
        name: "",
        code: "",
        teacher_id: "",
        class_id: "",
      });

      fetchSubjects();
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Something went wrong", "error");
    }
  };

  // ============================
  // EDIT
  // ============================
  const handleEdit = (subject) => {
    setEditId(subject.id);
    setFormData({
      name: subject.name,
      code: subject.code,
      teacher_id: subject.teacher_id,
      class_id: subject.class_id,
    });
    setIsModalOpen(true);
  };

  // ============================
  // DELETE
  // ============================
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This subject will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
    });

    if (confirm.isConfirmed) {
      await deleteSubject(id);
      Swal.fire("Deleted!", "Subject deleted successfully", "success");
      fetchSubjects();
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Subjects</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Subject
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
                <th className="p-3">Name</th>
                <th className="p-3">Code</th>
                <th className="p-3">Class</th>
                <th className="p-3">Teacher</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.id} className="border-t">
                  <td className="p-3">{subject.name}</td>
                  <td className="p-3">{subject.code}</td>
                  <td className="p-3">{subject.class?.name}</td>
                  <td className="p-3">
                    {subject.teachers?.length > 0
                      ? subject.teachers[0]?.name
                      : "N/A"}
                  </td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleEdit(subject)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(subject.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination pageData={pageData} onPageChange={fetchSubjects} />
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">
          {editId ? "Edit Subject" : "Add Subject"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Subject Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            name="code"
            placeholder="Subject Code"
            value={formData.code}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <select
            name="class_id"
            value={formData.class_id}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>

          <select
            name="teacher_id"
            value={formData.teacher_id}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded w-full"
          >
            {editId ? "Update Subject" : "Create Subject"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Subjects;
