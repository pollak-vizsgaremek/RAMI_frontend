import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  BookOpen,
} from "lucide-react";
import {
  getInstructorsList,
  approveInstructor,
  rejectInstructor,
  deleteInstructor,
} from "../../services/api/adminService.js";
import { toast } from "react-toastify";

const AdminInstructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("view");

  const fetchInstructors = useCallback(async () => {
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
  }, [filterStatus]);

  useEffect(() => {
    fetchInstructors();
  }, [fetchInstructors]);

  const handleApprove = async (instructorId) => {
    try {
      await approveInstructor(instructorId);
      toast.success("Oktató jóváhagyva");
      fetchInstructors();
    } catch (error) {
      toast.error(error.message || "Hiba a jóváhagyás során");
    }
  };

  const handleReject = async (reason) => {
    try {
      await rejectInstructor(selectedInstructor._id, reason);
      toast.success("Oktató elutasítva");
      setShowModal(false);
      fetchInstructors();
    } catch (error) {
      toast.error(error.message || "Hiba az elutasítás során");
    }
  };

  const handleDelete = async (instructorId) => {
    if (!window.confirm("Biztosan törölni szeretnéd ezt az oktatót?")) return;
    try {
      await deleteInstructor(instructorId);
      toast.success("Oktató törölve");
      fetchInstructors();
    } catch (error) {
      toast.error(error.message || "Hiba a törlés során");
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-[#F6C90E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bento */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
            <BookOpen size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Oktatók</h1>
            <p className="text-slate-500 font-medium">
              Profilok jóváhagyása és kezelése
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
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl font-medium focus:ring-2 focus:ring-[#F6C90E]"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-[#F6C90E] cursor-pointer">
            <option value="all">Minden Státusz</option>
            <option value="pending">Függőben</option>
            <option value="approved">Jóváhagyva</option>
            <option value="rejected">Elutasítva</option>
          </select>
        </div>
      </div>

      {/* Instructor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInstructors.length > 0 ? (
          filteredInstructors.map((instructor) => (
            <div
              key={instructor._id}
              className="bg-white rounded-[32px] p-6 shadow-sm hover:shadow-lg transition-all group flex flex-col relative overflow-hidden">
              {/* Status Indicator Line */}
              <div
                className={`absolute top-0 left-0 right-0 h-2 ${
                  instructor.status === "approved"
                    ? "bg-green-400"
                    : instructor.status === "rejected"
                      ? "bg-red-400"
                      : "bg-yellow-400"
                }`}></div>

              <div className="flex justify-between items-start mt-2 mb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {instructor.name || "N/A"}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium">
                    {instructor.email || "N/A"}
                  </p>
                </div>
                <div className="bg-slate-50 px-3 py-1 rounded-xl flex items-center gap-1">
                  <span className="text-[#F6C90E] text-lg">★</span>
                  <span className="font-black text-slate-900">
                    {instructor.rating?.toFixed(1) || "0.0"}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 mb-4 flex-1">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                  Iskola
                </p>
                <p className="text-slate-700 font-medium line-clamp-2">
                  {instructor.schools?.[0]?.name || "Nincs megadva"}
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    setSelectedInstructor(instructor);
                    setModalMode("view");
                    setShowModal(true);
                  }}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors flex-1 text-center">
                  Részletek
                </button>
                <div className="flex gap-2">
                  {instructor.status !== "approved" && (
                    <button
                      onClick={() => handleApprove(instructor._id)}
                      className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors"
                      title="Jóváhagyás">
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
                      className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-colors"
                      title="Elutasítás">
                      <XCircle size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(instructor._id)}
                    className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                    title="Törlés">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-[32px] p-12 text-center shadow-sm">
            <BookOpen size={48} className="mx-auto mb-4 text-slate-200" />
            <p className="text-slate-500 font-medium text-lg">Nincs találat</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedInstructor && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[32px] shadow-2xl max-w-md w-full p-8 transform transition-all">
            {modalMode === "view" && (
              <>
                <h2 className="text-2xl font-black text-slate-900 mb-6">
                  Oktatói Adatlap
                </h2>
                <div className="space-y-4 bg-slate-50 p-6 rounded-2xl mb-8">
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase mb-1">
                      Név
                    </span>
                    <span className="text-slate-900 font-bold">
                      {selectedInstructor.name || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase mb-1">
                      Email
                    </span>
                    <span className="text-slate-900 font-bold">
                      {selectedInstructor.email || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase mb-1">
                      Iskola
                    </span>
                    <span className="text-slate-900 font-bold">
                      {selectedInstructor.schools?.[0]?.name || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase mb-1">
                      Értékelések Száma
                    </span>
                    <span className="text-slate-900 font-bold">
                      {selectedInstructor.reviewCount || 0} db
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full px-4 py-4 bg-[#F6C90E] text-slate-900 font-black rounded-2xl hover:bg-[#e0b808] transition-colors shadow-lg shadow-yellow-500/30">
                  Bezárás
                </button>
              </>
            )}

            {modalMode === "reject" && (
              <>
                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                  <XCircle size={32} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">
                  Oktató Elutasítása
                </h2>
                <p className="text-slate-500 font-medium mb-6">
                  Biztosan elutasítod{" "}
                  <strong className="text-slate-900">
                    {selectedInstructor.name}
                  </strong>{" "}
                  jelentkezését?
                </p>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-500 ml-1 mb-2">
                    Indoklás (opcionális)
                  </label>
                  <textarea
                    id="rejectReason"
                    placeholder="Írd le az okot..."
                    rows="3"
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-medium focus:ring-2 focus:ring-orange-500 resize-none"></textarea>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors">
                    Mégse
                  </button>
                  <button
                    onClick={() =>
                      handleReject(
                        document.getElementById("rejectReason").value,
                      )
                    }
                    className="flex-1 px-4 py-3 bg-orange-500 text-white font-black rounded-2xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30">
                    Elutasítás
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
