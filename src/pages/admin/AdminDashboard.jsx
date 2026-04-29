import React, { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  Star,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { api } from "../../services/api/authService.js";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInstructors: 0,
    approvedInstructors: 0,
    pendingInstructors: 0,
    totalReviews: 0,
    approvedReviews: 0,
    pendingReports: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/admin/analytics`);
        if (res.data?.data) {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        // Ha 403-at kapunk, próbáljuk közvetlenül lekérni az adatokat
        try {
          const [usersRes, instructorsRes] = await Promise.all([
            api.get(`/admin/users`),
            api.get(`/admin/instructors`),
          ]);
          setStats({
            totalUsers: usersRes.data?.total || usersRes.data?.users?.length || 0,
            totalInstructors: instructorsRes.data?.total || instructorsRes.data?.instructors?.length || 0,
            approvedInstructors: (instructorsRes.data?.instructors || []).filter(i => i.approvalStatus === "approved").length,
            pendingInstructors: (instructorsRes.data?.instructors || []).filter(i => i.approvalStatus === "pending").length,
            totalReviews: 0,
            approvedReviews: 0,
            pendingReports: 0,
          });
        } catch (fallbackError) {
          console.error("Fallback fetch error:", fallbackError);
          toast.error("Nem sikerült az adatok betöltése");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    {
      icon: Users,
      title: "Összes felhasználó",
      value: stats.totalUsers,
      color: "border-blue-500 bg-blue-50",
    },
    {
      icon: BookOpen,
      title: "Összes oktató",
      value: stats.totalInstructors,
      color: "border-purple-500 bg-purple-50",
    },
    {
      icon: CheckCircle,
      title: "Jóváhagyott oktatók",
      value: stats.approvedInstructors,
      color: "border-green-500 bg-green-50",
    },
    {
      icon: Clock,
      title: "Függőben lévő oktatók",
      value: stats.pendingInstructors,
      color: "border-yellow-500 bg-yellow-50",
    },
    {
      icon: Star,
      title: "Összes értékelés",
      value: stats.totalReviews,
      color: "border-orange-500 bg-orange-50",
    },
    {
      icon: FileText,
      title: "Jóváhagyott értékelések",
      value: stats.approvedReviews,
      color: "border-teal-500 bg-teal-50",
    },
    {
      icon: AlertCircle,
      title: "Függőben lévő jelentések",
      value: stats.pendingReports || 0,
      color: "border-red-500 bg-red-50",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F6C90E]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Irányítópult</h1>
        <p className="text-gray-500 mt-2">
          Üdvözlet vissza a RAMI irányítópultban
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`bg-white rounded-2xl p-6 shadow-sm border-l-4 transition-all hover:shadow-lg ${card.color}`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-2">{card.value}</h3>
                </div>
                <div className="p-3 rounded-lg">
                  <Icon className="text-gray-700" size={28} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <a
          href="/admin/users"
          className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all border-2 border-transparent hover:border-[#F6C90E]">
          <Users className="text-blue-600 mb-3" size={32} />
          <h3 className="font-semibold text-gray-900">Felhasználók kezelése</h3>
          <p className="text-xs text-gray-500 mt-2">
            Összes felhasználó megtekintése
          </p>
        </a>

        <a
          href="/admin/instructors"
          className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all border-2 border-transparent hover:border-[#F6C90E]">
          <BookOpen className="text-purple-600 mb-3" size={32} />
          <h3 className="font-semibold text-gray-900">Oktatók kezelése</h3>
          <p className="text-xs text-gray-500 mt-2">
            Oktatók adatai és profilja
          </p>
        </a>

        <a
          href="/admin/reviews"
          className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all border-2 border-transparent hover:border-[#F6C90E]">
          <Star className="text-yellow-600 mb-3" size={32} />
          <h3 className="font-semibold text-gray-900">Értékelések</h3>
          <p className="text-xs text-gray-500 mt-2">Szűrés és moderálás</p>
        </a>

        <a
          href="/admin/settings"
          className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all border-2 border-transparent hover:border-[#F6C90E]">
          <FileText className="text-orange-600 mb-3" size={32} />
          <h3 className="font-semibold text-gray-900">Beállítások</h3>
          <p className="text-xs text-gray-500 mt-2">
            Rendszer beállítások
          </p>
        </a>
        <a
          href="/admin/reports"
          className="bg-white border border-gray-100 p-4 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-red-50 hover:border-red-200 transition-all cursor-pointer group">
          <div className="bg-red-50 p-3 rounded-full group-hover:bg-red-100 transition-colors">
            <AlertCircle size={24} className="text-red-600" />
          </div>
          <span className="font-bold text-gray-700">Jelentések</span>
        </a>
      </div>

      {/* Pending alerts */}
      {stats.pendingInstructors > 0 && (
        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <Clock className="text-orange-600 shrink-0 mt-1" size={24} />
            <div className="flex-1">
              <h3 className="font-bold text-orange-900 text-lg">
                Függőben lévő oktatók
              </h3>
              <p className="text-orange-800 mt-1">
                {stats.pendingInstructors} oktató vár jóváhagyásra.
              </p>
              <a
                href="/admin/instructors"
                className="inline-block mt-3 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-all">
                Oktatók megtekintése →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
