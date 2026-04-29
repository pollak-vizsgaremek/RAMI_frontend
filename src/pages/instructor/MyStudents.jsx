import React, { useState, useEffect, useCallback } from "react";
import { Users, UserCheck, UserX, Clock, CheckCircle } from "lucide-react";
import { api } from "../../services/api/authService.js";
import { getStoredUser } from "../../services/storage/storageService.js";
import { toast } from "react-toastify";

const MyStudents = () => {
  const [students, setStudents] = useState([]);
  const [pendingNominations, setPendingNominations] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = getStoredUser();
  const instructorId = user?.instructorId || user?.id;

  const fetchStudents = useCallback(async () => {
    if (!instructorId) return;
    try {
      setLoading(true);
      const res = await api.get(`/instructor/${instructorId}/my-students`);
      setStudents(res.data.students || []);
      setPendingNominations(res.data.pendingNominations || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Nem sikerült a tanulók betöltése");
    } finally {
      setLoading(false);
    }
  }, [instructorId]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleAccept = async (userId) => {
    try {
      await api.post(`/instructor/${instructorId}/accept-student`, { userId });
      toast.success("Tanuló elfogadva!");
      fetchStudents();
    } catch (error) {
      toast.error("Hiba az elfogadás során");
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm("Biztosan elutasítod ezt a jelölést?")) return;
    try {
      await api.post(`/instructor/${instructorId}/reject-student`, { userId });
      toast.success("Jelölés elutasítva");
      fetchStudents();
    } catch (error) {
      toast.error("Hiba az elutasítás során");
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
    <main className="min-h-screen pt-28 pb-12 px-4 md:px-8 max-w-4xl mx-auto w-full">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white mb-2">Tanulóim</h1>
        <p className="text-gray-400 text-lg">
          Tanulóid kezelése és jelölések elfogadása
        </p>
      </div>

      {/* Pending Nominations */}
      {pendingNominations.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-yellow-500/20 text-yellow-400 rounded-xl flex items-center justify-center">
              <Clock size={20} />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Függőben lévő jelölések
              <span className="ml-2 text-sm bg-yellow-500/20 text-yellow-400 px-2.5 py-0.5 rounded-full">
                {pendingNominations.length}
              </span>
            </h2>
          </div>

          <div className="space-y-3">
            {pendingNominations.map((student) => (
              <div
                key={student._id}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-yellow-500/30 transition-colors">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {student.name || "Ismeretlen"}
                  </h3>
                  <p className="text-gray-400 text-sm">{student.email}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAccept(student._id)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl font-bold text-sm hover:bg-green-500 hover:text-white transition-all cursor-pointer">
                    <UserCheck size={16} />
                    Elfogadás
                  </button>
                  <button
                    onClick={() => handleReject(student._id)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all cursor-pointer">
                    <UserX size={16} />
                    Elutasítás
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Current Students */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-xl flex items-center justify-center">
            <CheckCircle size={20} />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Jelenlegi tanulóim
            <span className="ml-2 text-sm bg-green-500/20 text-green-400 px-2.5 py-0.5 rounded-full">
              {students.length}
            </span>
          </h2>
        </div>

        {students.length > 0 ? (
          <div className="space-y-3">
            {students.map((student) => (
              <div
                key={student._id}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:border-green-500/30 transition-colors">
                <div className="w-11 h-11 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center font-bold text-lg">
                  {(student.name || "?")[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {student.name || "Ismeretlen"}
                  </h3>
                  <p className="text-gray-400 text-sm">{student.email}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
            <Users size={40} className="mx-auto mb-3 text-gray-600" />
            <p className="text-gray-400 text-lg">Még nincsenek tanulóid</p>
            <p className="text-gray-500 text-sm mt-1">
              Ha egy diák jelöl téged oktatónak, itt fog megjelenni.
            </p>
          </div>
        )}
      </section>
    </main>
  );
};

export default MyStudents;
