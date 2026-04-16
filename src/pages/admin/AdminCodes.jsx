import React, { useState, useEffect } from "react";
import { Copy, Trash2, Plus, RefreshCw, CheckCircle, Clock, AlertCircle } from "lucide-react";
import toast from "react-toastify";
import { useAuth } from "../../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";

export default function AdminCodes() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [codes, setCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    role: "admin",
    expiresIn: 24,
  });

  // Fetch codes on mount
  useEffect(() => {
    if (!isAdmin()) {
      navigate("/");
      return;
    }
    fetchCodes();
  }, []);

  // Fetch active codes
  const fetchCodes = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch("http://localhost:3300/api/v1/auth/admin/codes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch codes");
      }

      const data = await response.json();
      setCodes(data.codes || []);
    } catch (error) {
      console.error("Error fetching codes:", error);
      toast.error("Hiba a kódok lekérésekor.");
    } finally {
      setLoading(false);
    }
  };

  // Generate new code
  const handleGenerateCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast.error("Az email cím megadása szükséges!");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Érvénytelen email formátum!");
      return;
    }

    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch("http://localhost:3300/api/v1/auth/admin/generate-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: formData.email,
          role: formData.role,
          expiresIn: formData.expiresIn,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Hiba a kód generálása során.");
        return;
      }

      const data = await response.json();
      toast.success("Regisztrációs kód sikeresen generálva!");

      // Copy code to clipboard
      navigator.clipboard.writeText(data.code);
      toast.success("Kód a vágólapra másolva!");

      // Reset form
      setFormData({
        email: "",
        role: "admin",
        expiresIn: 24,
      });
      setShowGenerateForm(false);

      // Refresh codes list
      fetchCodes();
    } catch (error) {
      console.error("Error generating code:", error);
      toast.error("Hiba a kód generálása során.");
    } finally {
      setLoading(false);
    }
  };

  // Revoke code
  const handleRevokeCode = async (code: string) => {
    if (!window.confirm("Biztosan meg szeretnéd semmisíteni ezt a kódot?")) {
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`http://localhost:3300/api/v1/auth/admin/codes/${code}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to revoke code");
      }

      toast.success("Kód sikeresen megsemmisítve.");
      fetchCodes();
    } catch (error) {
      console.error("Error revoking code:", error);
      toast.error("Hiba a kód megsemmisítése során.");
    }
  };

  // Copy to clipboard
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("Kód a vágólapra másolva!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getRoleDisplay = (role: string) => {
    const roleMap: any = {
      creator: "Adminisztrátor (Creator)",
      admin: "Adminisztrátor",
      moderator: "Moderátor",
    };
    return roleMap[role] || role;
  };

  const isCodeExpired = (expiresAt: string) => new Date() > new Date(expiresAt);

  const getRemainingTime = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();

    if (diff < 0) return "Lejárt";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const activeCodes = codes.filter((c) => !c.used && !c.isExpired);
  const usedCodes = codes.filter((c) => c.used);
  const expiredCodes = codes.filter((c) => c.isExpired);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Regisztrációs Kódok</h1>
        <button
          onClick={() => setShowGenerateForm(!showGenerateForm)}
          className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold px-4 py-2 rounded-lg transition"
        >
          <Plus size={20} />
          Új Kód Generálása
        </button>
      </div>

      {/* Generate Code Form */}
      {showGenerateForm && (
        <div className="bg-white border-l-4 border-yellow-400 rounded-lg p-6 shadow">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Új Regisztrációs Kód</h2>

          <form onSubmit={handleGenerateCode} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email Cím
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@example.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Szerepkör
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="admin">Adminisztrátor</option>
                  <option value="creator">Creator (Teljes Admin)</option>
                  <option value="moderator">Moderátor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Érvényesség (óra)
                </label>
                <select
                  value={formData.expiresIn}
                  onChange={(e) => setFormData({ ...formData, expiresIn: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value={1}>1 óra</option>
                  <option value={6}>6 óra</option>
                  <option value={24}>24 óra</option>
                  <option value={72}>72 óra</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold px-6 py-2 rounded-lg transition disabled:opacity-50"
              >
                Kód Generálása
              </button>
              <button
                type="button"
                onClick={() => setShowGenerateForm(false)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold px-6 py-2 rounded-lg transition"
              >
                Mégse
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border-l-4 border-green-500 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Aktív Kódok</p>
              <p className="text-3xl font-bold text-green-600">{activeCodes.length}</p>
            </div>
            <CheckCircle size={32} className="text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Felhasznált Kódok</p>
              <p className="text-3xl font-bold text-blue-600">{usedCodes.length}</p>
            </div>
            <CheckCircle size={32} className="text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border-l-4 border-red-500 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Lejárt Kódok</p>
              <p className="text-3xl font-bold text-red-600">{expiredCodes.length}</p>
            </div>
            <AlertCircle size={32} className="text-red-500" />
          </div>
        </div>
      </div>

      {/* Active Codes */}
      {activeCodes.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-green-50 px-6 py-3 border-b">
            <h2 className="font-bold text-slate-800">Aktív Kódok</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                    Kód
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                    Szerepkör
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                    Lejár
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">
                    Műveletek
                  </th>
                </tr>
              </thead>
              <tbody>
                {activeCodes.map((code) => (
                  <tr key={code.code} className="border-b hover:bg-slate-50">
                    <td className="px-6 py-3 text-sm text-slate-800">{code.email}</td>
                    <td className="px-6 py-3 text-sm">
                      <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono">
                        {code.code.substring(0, 16)}...
                      </code>
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-800">
                      {getRoleDisplay(code.role)}
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-800 flex items-center gap-2">
                      <Clock size={16} className="text-yellow-500" />
                      {getRemainingTime(code.expiresAt)}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => copyToClipboard(code.code)}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm mr-3 transition"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={() => handleRevokeCode(code.code)}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-sm transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Used Codes */}
      {usedCodes.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-blue-50 px-6 py-3 border-b">
            <h2 className="font-bold text-slate-800">Felhasznált Kódok</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                    Kód
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                    Szerepkör
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                    Létrehozva
                  </th>
                </tr>
              </thead>
              <tbody>
                {usedCodes.map((code) => (
                  <tr key={code.code} className="border-b hover:bg-slate-50">
                    <td className="px-6 py-3 text-sm text-slate-800">{code.email}</td>
                    <td className="px-6 py-3 text-sm">
                      <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono">
                        {code.code.substring(0, 16)}...
                      </code>
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-800">
                      {getRoleDisplay(code.role)}
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-600">
                      {new Date(code.createdAt).toLocaleDateString("hu-HU")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Expired Codes */}
      {expiredCodes.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-red-50 px-6 py-3 border-b">
            <h2 className="font-bold text-slate-800">Lejárt Kódok</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                    Kód
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                    Szerepkör
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                    Lejárat
                  </th>
                </tr>
              </thead>
              <tbody>
                {expiredCodes.map((code) => (
                  <tr key={code.code} className="border-b opacity-60">
                    <td className="px-6 py-3 text-sm text-slate-800">{code.email}</td>
                    <td className="px-6 py-3 text-sm">
                      <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono">
                        {code.code.substring(0, 16)}...
                      </code>
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-800">
                      {getRoleDisplay(code.role)}
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-600">
                      {new Date(code.expiresAt).toLocaleDateString("hu-HU")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {codes.length === 0 && !loading && (
        <div className="bg-white rounded-lg p-8 text-center shadow">
          <p className="text-slate-600">Még nincs regisztrációs kód. Hozz létre egyet az új kód gombra kattintva!</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-lg p-8 text-center shadow">
          <p className="text-slate-600">Betöltés...</p>
        </div>
      )}
    </div>
  );
}
