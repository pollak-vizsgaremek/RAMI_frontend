import React, { useState, useEffect } from "react";
import { Search, CheckCircle, XCircle, Trash2, Eye } from "lucide-react";
import {
  getInstructorsList,
  approveInstructor,
  rejectInstructor,
  deleteInstructor,
} from "../services/api/adminService";
import { toast } from "react-toastify";

const AdminInstructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, pending, approved, rejected
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("view"); // view, reject

  useEffect(() => {
    fetchInstructors();
  }, [filterStatus]);

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const data = await getInstructorsList({
        status: filterStatus !== "all" ? filterStatus : undefined,
      });
      setInstructors(data.instructors || []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch instructors");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (instructorId) => {
    try {
      await approveInstructor(instructorId);
      toast.success("Instructor approved successfully");
      fetchInstructors();
    } catch (error) {
      toast.error(error.message || "Failed to approve instructor");
    }
  };

  const handleReject = async (reason) => {
    try {
      await rejectInstructor(selectedInstructor._id, reason);
      toast.success("Instructor rejected successfully");
      setShowModal(false);
      fetchInstructors();
    } catch (error) {
      toast.error(error.message || "Failed to reject instructor");
    }
  };

  const handleDelete = async (instructorId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this instructor? This action cannot be undone.",
      )
    ) {
      return;
    }
    try {
      await deleteInstructor(instructorId);
      toast.success("Instructor deleted successfully");
      fetchInstructors();
    } catch (error) {
      toast.error(error.message || "Failed to delete instructor");
    }
  };

  const filteredInstructors = instructors.filter(
    (instructor) =>
      instructor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.schools?.some((s) =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  const getStatusBadge = (status) => {
    const badges = {
      approved: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Approved",
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Pending",
      },
      rejected: { bg: "bg-red-100", text: "text-red-800", label: "Rejected" },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F6C90E]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Instructor Management
        </h1>
        <p className="text-gray-600 mt-1">
          Approve, reject, or manage instructor profiles on the platform.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name, email, or school..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C90E]"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C90E]">
            <option value="all">All Statuses</option>
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Instructors Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                School
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Reviews
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredInstructors.length > 0 ? (
              filteredInstructors.map((instructor) => (
                <tr
                  key={instructor._id}
                  className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {instructor.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {instructor.email || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {instructor.schools?.[0]?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {getStatusBadge(instructor.status || "pending")}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    ★ {instructor.rating?.toFixed(1) || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {instructor.reviewCount || 0}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setSelectedInstructor(instructor);
                        setModalMode("view");
                        setShowModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition inline-block"
                      title="View Details">
                      <Eye size={18} />
                    </button>
                    {instructor.status !== "approved" && (
                      <button
                        onClick={() => handleApprove(instructor._id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition inline-block"
                        title="Approve">
                        <CheckCircle size={18} />
                      </button>
                    )}
                    {instructor.status !== "rejected" && (
                      <button
                        onClick={() => {
                          setSelectedInstructor(instructor);
                          setModalMode("reject");
                          setShowModal(true);
                        }}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition inline-block"
                        title="Reject">
                        <XCircle size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(instructor._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition inline-block"
                      title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  No instructors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && selectedInstructor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            {modalMode === "view" && (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Instructor Details
                </h2>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Name
                    </label>
                    <p className="mt-1 text-gray-900">
                      {selectedInstructor.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <p className="mt-1 text-gray-900">
                      {selectedInstructor.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      School
                    </label>
                    <p className="mt-1 text-gray-900">
                      {selectedInstructor.schools?.[0]?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Status
                    </label>
                    <div className="mt-1">
                      {getStatusBadge(selectedInstructor.status || "pending")}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Rating
                    </label>
                    <p className="mt-1 text-gray-900">
                      ★ {selectedInstructor.rating?.toFixed(1) || "N/A"} (
                      {selectedInstructor.reviewCount || 0} reviews)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full px-4 py-2 bg-[#F6C90E] text-black font-semibold rounded-lg hover:bg-[#E6B90D] transition">
                  Close
                </button>
              </>
            )}

            {modalMode === "reject" && (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Reject Instructor
                </h2>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to reject{" "}
                  <strong>{selectedInstructor.name}</strong>?
                </p>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Reason for rejection (optional)
                  </label>
                  <textarea
                    placeholder="Enter reason..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C90E]"
                    rows="3"
                    id="rejectReason"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const reason =
                        document.getElementById("rejectReason").value;
                      handleReject(reason);
                    }}
                    className="flex-1 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition">
                    Reject
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInstructors;
