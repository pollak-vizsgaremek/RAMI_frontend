import React, { useState, useEffect, useCallback } from "react";
import { Search, CheckCircle, Eye, AlertTriangle } from "lucide-react";
import {
  getReportsList,
  resolveReport,
} from "../../services/api/adminService.js";
import { toast } from "react-toastify";

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchReports = useCallback(async () => {
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
  }, [filterStatus]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleResolveReport = async (action, reason = "") => {
    try {
      await resolveReport(selectedReport._id, action, reason);
      toast.success("Jelentés kezelve");
      setShowModal(false);
      fetchReports();
    } catch (error) {
      toast.error(error.message || "Hiba a jelentés kezelésekor");
    }
  };

  const filteredReports = reports.filter(
    (report) =>
      report.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedBy?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-[#F6C90E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bento */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 border-b-4 border-red-500">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
            <AlertTriangle size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Jelentések</h1>
            <p className="text-slate-500 font-medium">
              Szabálysértések kivizsgálása
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Keresés..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl font-medium focus:ring-2 focus:ring-red-400"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-red-400 cursor-pointer">
            <option value="all">Összes</option>
            <option value="pending">Függőben</option>
            <option value="resolved">Kezelve</option>
            <option value="dismissed">Elvetve</option>
          </select>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <div
              key={report._id}
              className={`bg-white rounded-[32px] p-6 shadow-sm flex flex-col border-l-8 ${report.status === "pending" ? "border-orange-400" : "border-slate-200"}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider mb-2 inline-block">
                    {report.type || "Értékelés"}
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    Jelentés #{report._id?.slice(-6) || "N/A"}
                  </h3>
                </div>
                <div
                  className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 ${
                    report.priority === "high"
                      ? "bg-red-100 text-red-700"
                      : report.priority === "low"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-orange-100 text-orange-700"
                  }`}>
                  {report.priority === "high"
                    ? "Magas"
                    : report.priority === "low"
                      ? "Alacsony"
                      : "Közepes"}{" "}
                  Prió
                </div>
              </div>

              <div className="bg-red-50/50 p-4 rounded-2xl mb-4 flex-1 border border-red-100">
                <p className="text-xs font-bold text-red-400 uppercase mb-1">
                  Ok
                </p>
                <p className="text-red-900 font-medium">
                  {report.reason || "Nincs megadva"}
                </p>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <p className="text-sm font-medium text-slate-400">
                  Beküldő:{" "}
                  <span className="text-slate-700">
                    {report.reportedBy || "Anonymus"}
                  </span>
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedReport(report);
                      setShowModal(true);
                    }}
                    className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors">
                    <Eye size={18} />
                  </button>
                  {report.status !== "resolved" && (
                    <button
                      onClick={() => {
                        setSelectedReport({ ...report, action: "resolve" });
                        setShowModal(true);
                      }}
                      className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2">
                      <CheckCircle size={16} /> Kezelés
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-[32px] p-12 text-center shadow-sm">
            <AlertTriangle size={48} className="mx-auto mb-4 text-slate-200" />
            <p className="text-slate-500 font-medium text-lg">Nincs jelentés</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[32px] shadow-2xl max-w-lg w-full p-8 transform transition-all">
            <h2 className="text-2xl font-black text-slate-900 mb-6">
              {selectedReport.action === "resolve"
                ? "Jelentés Kezelése"
                : "Jelentés Részletei"}
            </h2>

            {selectedReport.action !== "resolve" ? (
              <>
                <div className="space-y-4 bg-slate-50 p-6 rounded-2xl mb-6">
                  <div className="flex justify-between border-b border-slate-200 pb-3">
                    <span className="text-sm font-bold text-slate-400 uppercase">
                      Beküldő
                    </span>
                    <span className="font-bold text-slate-900">
                      {selectedReport.reportedBy || "Anonymus"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-3">
                    <span className="text-sm font-bold text-slate-400 uppercase">
                      Típus
                    </span>
                    <span className="font-bold text-slate-900">
                      {selectedReport.type || "Értékelés"}
                    </span>
                  </div>
                  <div className="pt-2">
                    <span className="block text-sm font-bold text-red-400 uppercase mb-2">
                      Jelentés Oka
                    </span>
                    <p className="text-slate-900 font-medium">
                      {selectedReport.reason}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full px-4 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-colors">
                  Bezárás
                </button>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-500 ml-1 mb-2">
                    Művelet
                  </label>
                  <select
                    id="actionSelect"
                    defaultValue="dismiss"
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-[#F6C90E]">
                    <option value="dismiss">Elvetés (Nincs akció)</option>
                    <option value="warn">Figyelmeztetés küldése</option>
                    <option value="delete">Tartalom törlése</option>
                    <option value="ban">Felhasználó kitiltása</option>
                  </select>
                </div>
                <div className="mb-8">
                  <label className="block text-sm font-bold text-slate-500 ml-1 mb-2">
                    Megjegyzés (Belső)
                  </label>
                  <textarea
                    id="resolutionNotes"
                    placeholder="Döntés indoklása..."
                    rows="3"
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-medium focus:ring-2 focus:ring-[#F6C90E] resize-none"></textarea>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors">
                    Mégse
                  </button>
                  <button
                    onClick={() =>
                      handleResolveReport(
                        document.getElementById("actionSelect").value,
                        document.getElementById("resolutionNotes").value,
                      )
                    }
                    className="flex-1 px-4 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-colors shadow-lg">
                    Mentés
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
