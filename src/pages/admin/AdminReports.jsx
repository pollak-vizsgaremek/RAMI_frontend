import React, { useState, useEffect } from "react";
import { Search, CheckCircle, Trash2, Eye, AlertTriangle } from "lucide-react";
import {
  getReportsList,
  resolveReport,
} from "../../services/api/adminService.js";
import { toast } from "react-toastify";

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, pending, resolved
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [filterStatus]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await getReportsList({
        status: filterStatus !== "all" ? filterStatus : undefined,
      });
      setReports(data.reports || []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  const handleResolveReport = async (action, reason = "") => {
    try {
      await resolveReport(selectedReport._id, action, reason);
      toast.success("Report resolved successfully");
      setShowModal(false);
      fetchReports();
    } catch (error) {
      toast.error(error.message || "Failed to resolve report");
    }
  };

  const filteredReports = reports.filter(
    (report) =>
      report.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedContent?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusBadge = (status) => {
    const badges = {
      resolved: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "✓ Resolved",
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "⏳ Pending",
      },
      dismissed: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        label: "✗ Dismissed",
      },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      high: { bg: "bg-red-100", text: "text-red-800", label: "High" },
      medium: { bg: "bg-orange-100", text: "text-orange-800", label: "Medium" },
      low: { bg: "bg-blue-100", text: "text-blue-800", label: "Low" },
    };
    const badge = badges[priority] || badges.medium;
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F6C90E]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports Management</h1>
        <p className="text-gray-600 mt-1">
          Review and resolve user reports about reviews, instructors, or other
          content.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by reason or reported content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C90E]"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C90E]">
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>
      </div>

      {/* Reports Cards */}
      <div className="space-y-4">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <div
              key={report._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-l-4 border-yellow-400">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={18} className="text-orange-500" />
                    <h3 className="text-lg font-bold text-gray-900">
                      Report #{report._id?.slice(-6) || "N/A"}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Reported by: {report.reportedBy || "Anonymous"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(report.status || "pending")}
                  {getPriorityBadge(report.priority || "medium")}
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded mb-4">
                <p className="text-sm font-semibold text-gray-600">Reason</p>
                <p className="text-gray-700 mt-1">
                  {report.reason || "No reason provided"}
                </p>
              </div>

              {report.reportedContent && (
                <div className="bg-gray-50 p-3 rounded mb-4">
                  <p className="text-sm font-semibold text-gray-600">
                    Reported Content
                  </p>
                  <p className="text-gray-700 mt-1 line-clamp-2">
                    {report.reportedContent}
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                <span>Type: {report.type || "Review"}</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedReport(report);
                    setShowModal(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition inline-block border border-blue-200">
                  <Eye size={18} />
                </button>
                {report.status !== "resolved" && (
                  <button
                    onClick={() => {
                      setSelectedReport({ ...report, action: "resolve" });
                      setShowModal(true);
                    }}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition inline-block border border-green-200"
                    title="Mark as Resolved">
                    <CheckCircle size={18} />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            <AlertTriangle size={32} className="mx-auto mb-2 opacity-50" />
            No reports found
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {selectedReport.action === "resolve"
                ? "Resolve Report"
                : "Report Details"}
            </h2>

            {selectedReport.action !== "resolve" ? (
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Reported By
                    </label>
                    <p className="mt-1 text-gray-900">
                      {selectedReport.reportedBy || "Anonymous"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Type
                    </label>
                    <p className="mt-1 text-gray-900">
                      {selectedReport.type || "Review"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Priority
                    </label>
                    <div className="mt-1">
                      {getPriorityBadge(selectedReport.priority || "medium")}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Status
                    </label>
                    <div className="mt-1">
                      {getStatusBadge(selectedReport.status || "pending")}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Reason
                  </label>
                  <p className="mt-1 text-gray-700 p-3 bg-gray-50 rounded">
                    {selectedReport.reason}
                  </p>
                </div>
                {selectedReport.reportedContent && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Reported Content
                    </label>
                    <p className="mt-1 text-gray-700 p-3 bg-gray-50 rounded">
                      {selectedReport.reportedContent}
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Date Reported
                  </label>
                  <p className="mt-1 text-gray-900">
                    {new Date(selectedReport.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800">
                    <strong>Report Reason:</strong> {selectedReport.reason}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Resolution Action
                  </label>
                  <select
                    id="actionSelect"
                    defaultValue="delete"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C90E]">
                    <option value="delete">Delete Reported Content</option>
                    <option value="warn">Warn User</option>
                    <option value="ban">Ban User</option>
                    <option value="dismiss">Dismiss Report</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    placeholder="Add resolution notes..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C90E]"
                    rows="3"
                    id="resolutionNotes"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                {selectedReport.action === "resolve" ? "Cancel" : "Close"}
              </button>
              {selectedReport.action === "resolve" && (
                <button
                  onClick={() => {
                    const action =
                      document.getElementById("actionSelect").value;
                    const notes =
                      document.getElementById("resolutionNotes").value;
                    handleResolveReport(action, notes);
                  }}
                  className="flex-1 px-4 py-2 bg-[#F6C90E] text-black font-semibold rounded-lg hover:bg-[#E6B90D] transition">
                  Resolve
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
