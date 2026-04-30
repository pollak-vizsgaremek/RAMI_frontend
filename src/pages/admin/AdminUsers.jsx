import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  AlertCircle,
  Users,
} from "lucide-react";
import {
  getUsersList,
  updateUser,
  deleteUser,
  banUser,
} from "../../services/api/adminService.js";
import { toast } from "react-toastify";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("view");

  const fetchUsers = useCallback(async () => {
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
  }, [filterRole]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEditUser = async () => {
    try {
      await updateUser(selectedUser._id, selectedUser);
      toast.success("Felhasználó sikeresen frissítve");
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.message || "Hiba a felhasználó frissítésekor");
    }
  };

  const handleBanUser = async (reason) => {
    try {
      await banUser(selectedUser._id, reason);
      toast.success("Felhasználó kitiltva");
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.message || "Hiba a kitiltás során");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      !window.confirm(
        "Biztosan törölni szeretnéd ezt a felhasználót? Ez a művelet nem vonható vissza.",
      )
    )
      return;
    try {
      await deleteUser(userId);
      toast.success("Felhasználó törölve");
      fetchUsers();
    } catch (error) {
      toast.error(error.message || "Hiba a törlés során");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-[#F6C90E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      <div className="bg-white rounded-[32px] p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Users size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Felhasználók</h1>
            <p className="text-slate-500 font-medium">
              Diákok, oktatók és adminok kezelése
            </p>
          </div>
        </div>

        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Keresés..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl font-medium focus:ring-2 focus:ring-[#F6C90E] transition-shadow"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-[#F6C90E] cursor-pointer appearance-none">
            <option value="all">Minden Szerepkör</option>
            <option value="creator">Admin</option>
            <option value="instructor">Oktató</option>
            <option value="student">Diák</option>
          </select>
        </div>
      </div>

      
      <div className="bg-white rounded-[32px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Név
                </th>
                <th className="px-8 py-5 text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-8 py-5 text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Szerepkör
                </th>
                <th className="px-8 py-5 text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Státusz
                </th>
                <th className="px-8 py-5 text-sm font-bold text-slate-400 uppercase tracking-wider text-right">
                  Műveletek
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-8 py-4 font-bold text-slate-900">
                      {user.name || "N/A"}
                    </td>
                    <td className="px-8 py-4 text-slate-500 font-medium">
                      {user.email || "N/A"}
                    </td>
                    <td className="px-8 py-4">
                      <span
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold inline-block ${
                          user.role === "creator"
                            ? "bg-purple-100 text-purple-700"
                            : user.role === "instructor"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-slate-100 text-slate-700"
                        }`}>
                        {user.role === "creator"
                          ? "Admin"
                          : user.role === "instructor"
                            ? "Oktató"
                            : "Diák"}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2">
                        {user.banned ? (
                          <span className="flex items-center gap-1.5 text-red-600 font-bold text-sm bg-red-50 px-3 py-1 rounded-lg">
                            <AlertCircle size={14} /> Kitiltva
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-green-600 font-bold text-sm bg-green-50 px-3 py-1 rounded-lg">
                            <CheckCircle size={14} /> Aktív
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setModalMode("view");
                            setShowModal(true);
                          }}
                          className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                          title="Szerkesztés">
                          <Edit size={18} />
                        </button>
                        {!user.banned && (
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setModalMode("ban");
                              setShowModal(true);
                            }}
                            className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-colors"
                            title="Kitiltás">
                            <Ban size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                          title="Törlés">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-8 py-12 text-center text-slate-400 font-medium">
                    Nincs találat
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[32px] shadow-2xl max-w-md w-full p-8 transform transition-all">
            {modalMode === "view" && (
              <>
                <h2 className="text-2xl font-black text-slate-900 mb-6">
                  Felhasználó Szerkesztése
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 ml-1 mb-2">
                      Név
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
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-medium focus:ring-2 focus:ring-[#F6C90E] transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 ml-1 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={selectedUser.email || ""}
                      disabled
                      className="w-full px-4 py-3 bg-slate-100 border-none rounded-2xl font-medium text-slate-400 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 ml-1 mb-2">
                      Szerepkör
                    </label>
                    <select
                      value={selectedUser.role || "student"}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          role: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-[#F6C90E]">
                      <option value="student">Diák</option>
                      <option value="instructor">Oktató</option>
                      <option value="creator">Admin</option>
                    </select>
                  </div>
                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors">
                      Mégse
                    </button>
                    <button
                      onClick={handleEditUser}
                      className="flex-1 px-4 py-3 bg-[#F6C90E] text-slate-900 font-black rounded-2xl hover:bg-[#e0b808] transition-colors shadow-lg shadow-yellow-500/30">
                      Mentés
                    </button>
                  </div>
                </div>
              </>
            )}

            {modalMode === "ban" && (
              <>
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6">
                  <Ban size={32} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">
                  Felhasználó Kitiltása
                </h2>
                <p className="text-slate-500 font-medium mb-6">
                  Biztosan ki szeretnéd tiltani{" "}
                  <strong className="text-slate-900">
                    {selectedUser.name}
                  </strong>{" "}
                  felhasználót?
                </p>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-500 ml-1 mb-2">
                    Ok (opcionális)
                  </label>
                  <textarea
                    id="banReason"
                    placeholder="Indoklás..."
                    rows="3"
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-medium focus:ring-2 focus:ring-red-500 resize-none"></textarea>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors">
                    Mégse
                  </button>
                  <button
                    onClick={() =>
                      handleBanUser(document.getElementById("banReason").value)
                    }
                    className="flex-1 px-4 py-3 bg-red-500 text-white font-black rounded-2xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30">
                    Kitiltás
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
