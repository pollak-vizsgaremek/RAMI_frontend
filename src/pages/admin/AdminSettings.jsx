import React, { useState, useEffect } from "react";
import { Save, AlertCircle, Settings as SettingsIcon } from "lucide-react";
import {
  getSystemSettings,
  updateSystemSettings,
} from "../../services/api/adminService.js";
import { toast } from "react-toastify";

const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await getSystemSettings();
      setSettings(data);
    } catch (error) {
      toast.error(error.message || "Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleNestedChange = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      await updateSystemSettings(settings);
      toast.success("Beállítások mentve");
      setHasChanges(false);
    } catch (error) {
      toast.error(error.message || "Hiba a mentés során");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-[#F6C90E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24">
      {/* Header Bento */}
      <div className="bg-slate-900 rounded-[32px] p-8 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center">
            <SettingsIcon size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">
              Rendszer Beállítások
            </h1>
            <p className="text-slate-400 font-medium">
              Platform működésének konfigurálása
            </p>
          </div>
        </div>
        {hasChanges && (
          <div className="bg-[#F6C90E] text-slate-900 px-4 py-2 rounded-xl font-bold flex items-center gap-2 animate-pulse">
            <AlertCircle size={18} /> Mentetlen változtatások
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm">
          <h2 className="text-xl font-black text-slate-900 mb-6">Általános</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-500 ml-1 mb-2">
                Platform Neve
              </label>
              <input
                type="text"
                value={settings?.platformName || ""}
                onChange={(e) =>
                  handleSettingChange("platformName", e.target.value)
                }
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-medium focus:ring-2 focus:ring-[#F6C90E]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-500 ml-1 mb-2">
                Support Email
              </label>
              <input
                type="email"
                value={settings?.supportEmail || ""}
                onChange={(e) =>
                  handleSettingChange("supportEmail", e.target.value)
                }
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-medium focus:ring-2 focus:ring-[#F6C90E]"
              />
            </div>
          </div>
        </div>

        {/* Features Toggles */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm">
          <h2 className="text-xl font-black text-slate-900 mb-6">
            Funkciók Kapcsolója
          </h2>
          <div className="space-y-3">
            {[
              { id: "userRegistration", label: "Felhasználói Regisztráció" },
              { id: "submitReviews", label: "Értékelések Beküldése" },
              { id: "leaderboard", label: "Ranglista Megjelenítése" },
              { id: "reportSystem", label: "Jelentési Rendszer" },
            ].map((feature) => (
              <label
                key={feature.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                <span className="font-bold text-slate-700">
                  {feature.label}
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings?.features?.[feature.id] !== false}
                    onChange={(e) =>
                      handleNestedChange(
                        "features",
                        feature.id,
                        e.target.checked,
                      )
                    }
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F6C90E]"></div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Moderation Settings */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm md:col-span-2">
          <h2 className="text-xl font-black text-slate-900 mb-6">
            Moderációs Szabályok
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-500 ml-1 mb-2">
                Min. Értékelés Hossz
              </label>
              <input
                type="number"
                value={settings?.moderation?.minReviewLength || 10}
                onChange={(e) =>
                  handleNestedChange(
                    "moderation",
                    "minReviewLength",
                    parseInt(e.target.value),
                  )
                }
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#F6C90E]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-500 ml-1 mb-2">
                Auto-kitiltás limit (Jelentés)
              </label>
              <input
                type="number"
                value={settings?.moderation?.autoBanThreshold || 5}
                onChange={(e) =>
                  handleNestedChange(
                    "moderation",
                    "autoBanThreshold",
                    parseInt(e.target.value),
                  )
                }
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#F6C90E]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-500 ml-1 mb-2">
                Értékelés Előzetes Jóváhagyása
              </label>
              <select
                value={settings?.moderation?.requireApproval ? "yes" : "no"}
                onChange={(e) =>
                  handleNestedChange(
                    "moderation",
                    "requireApproval",
                    e.target.value === "yes",
                  )
                }
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-[#F6C90E]">
                <option value="yes">Igen (Manuális)</option>
                <option value="no">Nem (Automatikus)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-md p-4 rounded-[32px] shadow-2xl border border-slate-100 flex items-center gap-4 z-40">
        <button
          onClick={() => window.location.reload()}
          disabled={!hasChanges}
          className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          Mégse
        </button>
        <button
          onClick={handleSaveSettings}
          disabled={!hasChanges || saving}
          className="flex items-center gap-2 px-8 py-3 bg-[#F6C90E] text-slate-900 font-black rounded-2xl hover:bg-[#e0b808] transition-colors shadow-lg shadow-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none">
          <Save size={20} />
          {saving ? "Mentés..." : "Beállítások Mentése"}
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
