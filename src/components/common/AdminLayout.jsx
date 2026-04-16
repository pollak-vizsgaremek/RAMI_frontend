import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  BarChart3,
  Users,
  FileText,
  AlertCircle,
  Settings,
  Key,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    {
      label: "Dashboard",
      icon: BarChart3,
      path: "/admin/dashboard",
      exact: false,
    },
    {
      label: "Users",
      icon: Users,
      path: "/admin/users",
    },
    {
      label: "Instructors",
      icon: Users,
      path: "/admin/instructors",
    },
    {
      label: "Reviews",
      icon: FileText,
      path: "/admin/reviews",
    },
    {
      label: "Reports",
      icon: AlertCircle,
      path: "/admin/reports",
    },
    {
      label: "Registration Codes",
      icon: Key,
      path: "/admin/codes",
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/admin/settings",
    },
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      await logout();
      window.location.href = "/";
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-[#3A4750] text-white transition-all duration-300 shadow-lg flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-700 rounded-lg transition">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  active
                    ? "bg-[#F6C90E] text-[#3A4750] font-semibold"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
                title={!sidebarOpen ? item.label : ""}>
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition"
            title={!sidebarOpen ? "Logout" : ""}>
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
