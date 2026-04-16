import React, { useState, useEffect } from "react";
import { Save, AlertCircle } from "lucide-react";
import {
  getSystemSettings,
  updateSystemSettings,
} from "../services/api/adminService";
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
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  const handleNestedChange = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      await updateSystemSettings(settings);
      toast.success("Settings saved successfully");
      setHasChanges(false);
    } catch (error) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F6C90E]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600 mt-1">
          Configure platform-wide settings and moderation rules.
        </p>
      </div>

      {hasChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-yellow-600" size={20} />
          <p className="text-sm text-yellow-800">You have unsaved changes</p>
        </div>
      )}

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Platform Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Platform Settings
          </h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform Name
                </label>
                <input
                  type="text"
                  value={settings?.platformName || "Rate My Instructor"}
                  onChange={(e) =>
                    handleSettingChange("platformName", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C90E]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Support Email
                </label>
                <input
                  type="email"
                  value={settings?.supportEmail || ""}
                  onChange={(e) =>
                    handleSettingChange("supportEmail", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C90E]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform Description
              </label>
              <textarea
                value={settings?.platformDescription || ""}
                onChange={(e) =>
                  handleSettingChange("platformDescription", e.target.value)
                }
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C90E]"
              />
            </div>
          </div>
        </div>

        {/* Moderation Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Moderation Settings
          </h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Review Length (characters)
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C90E]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Review Length (characters)
                </label>
                <input
                  type="number"
                  value={settings?.moderation?.maxReviewLength || 5000}
                  onChange={(e) =>
                    handleNestedChange(
                      "moderation",
                      "maxReviewLength",
                      parseInt(e.target.value),
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C90E]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Require Review Approval Before Publishing
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C90E]">
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auto-ban User After N Reports
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C90E]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Instructor Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Instructor Settings
          </h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Require Instructor Approval
                </label>
                <select
                  value={settings?.instructor?.requireApproval ? "yes" : "no"}
                  onChange={(e) =>
                    handleNestedChange(
                      "instructor",
                      "requireApproval",
                      e.target.value === "yes",
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C90E]">
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating to Display
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={settings?.instructor?.minRatingDisplay || 1.0}
                  onChange={(e) =>
                    handleNestedChange(
                      "instructor",
                      "minRatingDisplay",
                      parseFloat(e.target.value),
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C90E]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Feature Toggles
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">User Registration</p>
                <p className="text-sm text-gray-600">
                  Allow new users to register
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings?.features?.userRegistration !== false}
                onChange={(e) =>
                  handleNestedChange(
                    "features",
                    "userRegistration",
                    e.target.checked,
                  )
                }
                className="w-5 h-5 text-[#F6C90E] rounded focus:ring-2 focus:ring-[#F6C90E] cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">Submit Reviews</p>
                <p className="text-sm text-gray-600">
                  Allow users to submit reviews
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings?.features?.submitReviews !== false}
                onChange={(e) =>
                  handleNestedChange(
                    "features",
                    "submitReviews",
                    e.target.checked,
                  )
                }
                className="w-5 h-5 text-[#F6C90E] rounded focus:ring-2 focus:ring-[#F6C90E] cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">Leaderboard</p>
                <p className="text-sm text-gray-600">
                  Display instructor leaderboard
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings?.features?.leaderboard !== false}
                onChange={(e) =>
                  handleNestedChange(
                    "features",
                    "leaderboard",
                    e.target.checked,
                  )
                }
                className="w-5 h-5 text-[#F6C90E] rounded focus:ring-2 focus:ring-[#F6C90E] cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">Report System</p>
                <p className="text-sm text-gray-600">
                  Allow users to report reviews
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings?.features?.reportSystem !== false}
                onChange={(e) =>
                  handleNestedChange(
                    "features",
                    "reportSystem",
                    e.target.checked,
                  )
                }
                className="w-5 h-5 text-[#F6C90E] rounded focus:ring-2 focus:ring-[#F6C90E] cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="sticky bottom-0 bg-white border-t p-6 flex gap-3">
        <button
          onClick={() => window.location.reload()}
          disabled={!hasChanges}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50">
          Discard Changes
        </button>
        <button
          onClick={handleSaveSettings}
          disabled={!hasChanges || saving}
          className="flex items-center gap-2 px-6 py-2 bg-[#F6C90E] text-black font-semibold rounded-lg hover:bg-[#E6B90D] transition disabled:opacity-50">
          <Save size={18} />
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
