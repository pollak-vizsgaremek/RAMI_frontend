import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  BookOpen,
  Star,
  FileText,
  TrendingUp,
  BarChart3,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit2,
  Trash2,
  Download,
  Filter,
  Search,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInstructors: 0,
    totalReviews: 0,
    averageRating: 0,
    activeUsers: 0,
    pendingReviews: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const API_URL = "http://localhost:3300";

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/v1/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { period: selectedPeriod },
      });

      if (res.data) {
        setStats((prevStats) => res.data.stats || prevStats);
        setRecentActivity(res.data.recentActivity || []);
      }
    } catch (error) {
      toast.error("Nem sikerült az irányítópult adatainak betöltése");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const StatCard = ({ icon: Icon, title, value, subtext, color }) => (
    <div
      className={`bg-white rounded-2xl p-6 shadow-sm border-l-4 transition-all hover:shadow-lg ${color}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
          {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </div>
        <div
          className={`p-3 rounded-lg ${color.replace("border-l-4", "bg-opacity-10")}`}>
          <Icon className="text-gray-700" size={28} />
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ type, title, time, status }) => {
    const statusConfig = {
      success: {
        icon: CheckCircle,
        color: "text-green-600",
        bg: "bg-green-50",
      },
      pending: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
      error: { icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const StatusIcon = config.icon;

    return (
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <div className={`p-2 rounded-lg ${config.bg}`}>
          <StatusIcon className={`${config.color}`} size={18} />
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900">{title}</p>
          <p className="text-xs text-gray-500">{type}</p>
        </div>
        <span className="text-xs text-gray-500">{time}</span>
      </div>
    );
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Irányítópult</h1>
          <p className="text-gray-500 mt-2">
            Üdvözlet vissza a RAMI irányítópultban
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#F6C90E]">
            <option value="today">Ma</option>
            <option value="week">Ez a hét</option>
            <option value="month">Ez a hónap</option>
            <option value="year">Ez az év</option>
          </select>
          <button className="px-4 py-2 bg-[#F6C90E] hover:bg-[#e0b808] text-black font-semibold rounded-lg transition-all">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={Users}
          title="Összes felhasználó"
          value={stats.totalUsers}
          subtext={`${stats.activeUsers} aktív ma`}
          color="border-blue-500 bg-blue-50"
        />
        <StatCard
          icon={BookOpen}
          title="Összes oktató"
          value={stats.totalInstructors}
          subtext="Regisztrált oktatók"
          color="border-purple-500 bg-purple-50"
        />
        <StatCard
          icon={Star}
          title="Átlag értékelés"
          value={stats.averageRating.toFixed(1)}
          subtext="5 pontból"
          color="border-yellow-500 bg-yellow-50"
        />
        <StatCard
          icon={FileText}
          title="Összes értékelés"
          value={stats.totalReviews}
          subtext={`${stats.pendingReviews} függőben`}
          color="border-orange-500 bg-orange-50"
        />
        <StatCard
          icon={TrendingUp}
          title="Heti növekedés"
          value="+12.5%"
          subtext="Az előző héthez képest"
          color="border-green-500 bg-green-50"
        />
        <StatCard
          icon={AlertTriangle}
          title="Függőben lévő feladatok"
          value="5"
          subtext="Azonnali beavatkozás szükséges"
          color="border-red-500 bg-red-50"
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Heti aktivitás</h2>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Filter size={18} className="text-gray-600" />
            </button>
          </div>
          <div className="h-64 flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 rounded-lg">
            <div className="text-center">
              <BarChart3 size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Grafikon adatok betöltése...</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Friss tevékenység
          </h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, idx) => (
                <ActivityItem key={idx} {...activity} />
              ))
            ) : (
              <div className="text-center py-8">
                <Activity size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Nincs friss tevékenység</p>
              </div>
            )}
          </div>
        </div>
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
          href="/admin/reports"
          className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all border-2 border-transparent hover:border-[#F6C90E]">
          <FileText className="text-orange-600 mb-3" size={32} />
          <h3 className="font-semibold text-gray-900">Jelentések</h3>
          <p className="text-xs text-gray-500 mt-2">
            Részletes elemzések és riportok
          </p>
        </a>
      </div>

      {/* Critical Alerts */}
      {stats.pendingReviews > 0 && (
        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle
              className="text-orange-600 shrink-0 mt-1"
              size={24}
            />
            <div className="flex-1">
              <h3 className="font-bold text-orange-900 text-lg">
                Függőben lévő értékelések
              </h3>
              <p className="text-orange-800 mt-1">
                {stats.pendingReviews} értékelés vár jóváhagyásra. Nyomja meg az
                alábbi gombot, hogy megtekintse őket.
              </p>
              <a
                href="/admin/reviews"
                className="inline-block mt-3 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-all">
                Értékelések megtekintése →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
