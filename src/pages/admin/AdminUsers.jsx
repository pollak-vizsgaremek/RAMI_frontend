import React, { useState, useEffect } from "react";
import {
  Search,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  getUsersList,
  updateUser,
  deleteUser,
  banUser,
} from "../services/api/adminService";
import { toast } from "react-toastify";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("view"); // view, edit, ban

  useEffect(() => {
    fetchUsers();
  }, [filterRole]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsersList({
        role: filterRole !== "all" ? filterRole : undefined,
      });
      setUsers(data.users || []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async () => {
    try {
      await updateUser(selectedUser._id, selectedUser);
      toast.success("User updated successfully");
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.message || "Failed to update user");
    }
  };

  const handleBanUser = async (reason) => {
    try {
      await banUser(selectedUser._id, reason);
      toast.success("User banned successfully");
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.message || "Failed to ban user");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      return;
    }
    try {
      await deleteUser(userId);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error(error.message || "Failed to delete user");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-1">
          Manage all users, instructors, and students on the platform.
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
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C90E]"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C90E]">
            <option value="all">All Roles</option>
            <option value="creator">Admin (Creator)</option>
            <option value="instructor">Instructor</option>
            <option value="student">Student</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
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
                Role
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Joined
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {user.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.email || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "creator"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "instructor"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                      }`}>
                      {user.role === "creator"
                        ? "Admin"
                        : user.role || "Student"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      {user.banned ? (
                        <>
                          <AlertCircle size={16} className="text-red-500" />
                          <span className="text-red-600 font-medium">
                            Banned
                          </span>
                        </>
                      ) : (
                        <>
                          <CheckCircle size={16} className="text-green-500" />
                          <span className="text-green-600 font-medium">
                            Active
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setModalMode("view");
                        setShowModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition inline-block"
                      title="View/Edit">
                      <Edit size={18} />
                    </button>
                    {!user.banned && (
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setModalMode("ban");
                          setShowModal(true);
                        }}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition inline-block"
                        title="Ban User">
                        <Ban size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition inline-block"
                      title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            {modalMode === "view" && (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  User Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Name
                    </label>
                    <input
                      type="text"
                      value={selectedUser.name || ""}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          name: e.target.value,
                        })
                      }
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C90E]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <input
                      type="email"
                      value={selectedUser.email || ""}
                      disabled
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Role
                    </label>
                    <select
                      value={selectedUser.role || "student"}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          role: e.target.value,
                        })
                      }
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C90E]">
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="creator">Admin</option>
                    </select>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                      Cancel
                    </button>
                    <button
                      onClick={handleEditUser}
                      className="flex-1 px-4 py-2 bg-[#F6C90E] text-black font-semibold rounded-lg hover:bg-[#E6B90D] transition">
                      Save
                    </button>
                  </div>
                </div>
              </>
            )}

            {modalMode === "ban" && (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Ban User
                </h2>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to ban{" "}
                  <strong>{selectedUser.name}</strong>?
                </p>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Reason for ban (optional)
                  </label>
                  <textarea
                    placeholder="Enter reason..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C90E]"
                    rows="3"
                    id="banReason"
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
                      const reason = document.getElementById("banReason").value;
                      handleBanUser(reason);
                    }}
                    className="flex-1 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition">
                    Ban User
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

export default AdminUsers;
