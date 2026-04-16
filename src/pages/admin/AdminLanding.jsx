import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Users,
  FileText,
  AlertCircle,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";

const AdminLanding = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = async () => {
    const confirmLogout = window.confirm(
      "Admin panelből kijelentkezni szeretnél?",
    );
    if (confirmLogout) {
      await logout();
      sessionStorage.removeItem("userRole");
      window.dispatchEvent(new Event("authChange"));
      navigate("/");
    }
  };

  const adminFeatures = [
    {
      icon: BarChart3,
      label: "Dashboard",
      description: "Platform statisztikák és áttekintés",
      path: "/admin/dashboard",
      color: "bg-blue-500",
    },
    {
      icon: Users,
      label: "Felhasználók",
      description: "Felhasználók kezelése és moderálása",
      path: "/admin/users",
      color: "bg-green-500",
    },
    {
      icon: Users,
      label: "Oktatók",
      description: "Oktatók jóváhagyása és kezelése",
      path: "/admin/instructors",
      color: "bg-purple-500",
    },
    {
      icon: FileText,
      label: "Értékelések",
      description: "Értékelések moderálása és jóváhagyása",
      path: "/admin/reviews",
      color: "bg-yellow-500",
    },
    {
      icon: AlertCircle,
      label: "Jelentések",
      description: "Felhasználói jelentések kezelése",
      path: "/admin/reports",
      color: "bg-red-500",
    },
    {
      icon: Settings,
      label: "Beállítások",
      description: "Platform konfigurációs beállítások",
      path: "/admin/settings",
      color: "bg-indigo-500",
    },
  ];

  if (!isAdmin || !isAdmin()) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Shield size={48} className="mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Hozzáférés megtagadva
          </h1>
          <p className="text-gray-600">Nincs engedélye az admin panelhez</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#F6C90E] to-yellow-600 rounded-lg flex items-center justify-center">
                <Shield size={24} className="text-slate-900" />
              </div>
              <h1 className="text-4xl font-bold text-white">Admin Panel</h1>
            </div>
            <p className="text-gray-400">
              Üdvözlünk vissza,{" "}
              <span className="text-[#F6C90E] font-semibold">
                {user?.name || "Admin"}
              </span>
              !
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors border border-red-500/50">
            <LogOut size={18} />
            Kijelentkezés
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Admin Felhasználó</p>
            <p className="text-white font-semibold">{user?.email || "N/A"}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Státusz</p>
            <p className="text-green-400 font-semibold flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Aktív
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Platform Verzió</p>
            <p className="text-white font-semibold">v1.0.0</p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-bold text-white mb-6">Admin Funkciók</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.path}
                onClick={() => navigate(feature.path)}
                className="group relative overflow-hidden rounded-xl p-6 bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 active:scale-95 text-left">
                {/* Background gradient on hover */}
                <div
                  className={`absolute inset-0 ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                {/* Content */}
                <div className="relative z-10">
                  <div
                    className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {feature.label}
                  </h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                  <div className="mt-4 flex items-center text-[#F6C90E] text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Megnyitás →
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Security Notice */}
      <div className="max-w-7xl mx-auto mt-12">
        <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-6">
          <p className="text-blue-300 text-sm">
            <strong>🔒 Biztonsági figyelmeztetés:</strong> Győződj meg róla,
            hogy biztonságos helyen vagy. Az admin panel erőteljes kontrollt
            biztosít. Kérjük, óvatosan használd ezeket a funkciókat.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLanding;
