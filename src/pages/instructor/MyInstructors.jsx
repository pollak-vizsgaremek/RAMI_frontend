import React, { useState, useEffect, useCallback } from "react";
import { BookOpen, Star, MapPin, Award, Trash2, Shield, Clock } from "lucide-react";
import { api } from "../../services/api/authService.js";
import { getStoredUser } from "../../services/storage/storageService.js";
import { toast } from "react-toastify";

const MyInstructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = getStoredUser();
  const userId = user?.id;

  const fetchInstructors = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await api.get(`/user/${userId}/instructors`);
      setInstructors(res.data || []);
    } catch (error) {
      console.error("Error fetching instructors:", error);
      toast.error("Nem sikerült az oktatók betöltése");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchInstructors();
  }, [fetchInstructors]);

  const handleRemoveInstructor = async (instructorId) => {
    if (!window.confirm("Biztosan eltávolítod ezt az oktatót?")) return;
    try {
      await api.delete(`/user/${userId}/instructors/${instructorId}`);
      toast.success("Oktató sikeresen eltávolítva!");
      fetchInstructors();
    } catch (error) {
      console.error("Error removing instructor:", error);
      toast.error("Hiba az oktató eltávolítása során");
    }
  };

  const getApprovalStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-500/20 text-green-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "rejected":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getApprovalStatusText = (status) => {
    switch (status) {
      case "approved":
        return "Jóváhagyott";
      case "pending":
        return "Függőben";
      case "rejected":
        return "Elutasítva";
      default:
        return "Ismeretlen";
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-28 pb-12 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-700 border-t-[#F6C90E] rounded-full animate-spin"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-12 px-4 md:px-8 max-w-6xl mx-auto w-full">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white mb-2">Oktatóim</h1>
        <p className="text-gray-400 text-lg">
          Az oktatóid megtekintése és kezelése
        </p>
      </div>

      {instructors.length > 0 ? (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center">
              <BookOpen size={20} />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Oktatóim
              <span className="ml-2 text-sm bg-blue-500/20 text-blue-400 px-2.5 py-0.5 rounded-full">
                {instructors.length}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {instructors.map((instructor) => (
              <div
                key={instructor._id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-colors flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {instructor.name}
                    </h3>
                    <p className="text-gray-400 text-sm">{instructor.email}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveInstructor(instructor._id)}
                    className="ml-2 p-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all cursor-pointer">
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${getApprovalStatusColor(
                      instructor.approvalStatus
                    )}`}>
                    <Clock size={14} />
                    {getApprovalStatusText(instructor.approvalStatus)}
                  </div>
                  {instructor.isVerified && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                      <Shield size={14} />
                      Ellenőrzött
                    </div>
                  )}
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4 flex-1">
                  {/* Experience */}
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <Award size={16} className="text-yellow-400" />
                      <span className="text-xs text-gray-400">Tapasztalat</span>
                    </div>
                    <p className="text-lg font-bold text-white">
                      {instructor.experience} év
                    </p>
                  </div>

                  {/* City */}
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin size={16} className="text-blue-400" />
                      <span className="text-xs text-gray-400">Város</span>
                    </div>
                    <p className="text-lg font-bold text-white truncate">
                      {instructor.city}
                    </p>
                  </div>
                </div>

                {/* Schools */}
                {instructor.schools && instructor.schools.length > 0 && (
                  <div className="mt-auto pt-3 border-t border-white/10">
                    <p className="text-xs text-gray-400 mb-2">Iskolák:</p>
                    <div className="flex flex-wrap gap-2">
                      {instructor.schools.map((school) => (
                        <span
                          key={school._id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-lg text-xs font-medium">
                          <BookOpen size={12} />
                          {school.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
          <BookOpen size={40} className="mx-auto mb-3 text-gray-600" />
          <p className="text-gray-400 text-lg">Még nincsenek oktatóid</p>
          <p className="text-gray-500 text-sm mt-1">
            Az oktatók keresésével és jelölésével kezdj.
          </p>
        </div>
      )}
    </main>
  );
};

export default MyInstructors;
