import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  FileText,
} from "lucide-react";
import {
  getReviewsList,
  approveReview,
  rejectReview,
  deleteReview,
} from "../../services/api/adminService.js";
import { toast } from "react-toastify";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedReview, setSelectedReview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("view");

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getReviewsList({
        status: filterStatus !== "all" ? filterStatus : undefined,
      });
      setReviews(data.reviews || []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleApprove = async (reviewId) => {
    try {
      await approveReview(reviewId);
      toast.success("Értékelés jóváhagyva");
      fetchReviews();
    } catch (error) {
      toast.error(error.message || "Hiba a jóváhagyás során");
    }
  };

  const handleReject = async (reason) => {
    try {
      await rejectReview(selectedReview._id, reason);
      toast.success("Értékelés elutasítva");
      setShowModal(false);
      fetchReviews();
    } catch (error) {
      toast.error(error.message || "Hiba az elutasítás során");
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Biztosan törölni szeretnéd ezt az értékelést?"))
      return;
    try {
      await deleteReview(reviewId);
      toast.success("Értékelés törölve");
      fetchReviews();
    } catch (error) {
      toast.error(error.message || "Hiba a törlés során");
    }
  };

  const filteredReviews = reviews.filter(
    (review) =>
      review.instructorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.authorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase()),
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
      <div className="bg-slate-900 rounded-[32px] p-8 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-[100px] opacity-10"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 bg-white/10 text-white backdrop-blur-md rounded-2xl flex items-center justify-center">
            <FileText size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Értékelések</h1>
            <p className="text-slate-400 font-medium">
              Moderálás és közzététel
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto relative z-10">
          <div className="relative flex-1 sm:w-64">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Keresés tartalomban..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 text-white placeholder-slate-400 border-none rounded-2xl font-medium focus:ring-2 focus:ring-[#F6C90E] backdrop-blur-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-white/10 text-white border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#F6C90E] cursor-pointer appearance-none backdrop-blur-sm">
            <option value="all" className="text-slate-900">
              Összes
            </option>
            <option value="pending" className="text-slate-900">
              Függőben
            </option>
            <option value="approved" className="text-slate-900">
              Jóváhagyva
            </option>
            <option value="rejected" className="text-slate-900">
              Elutasítva
            </option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-[32px] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {review.instructorName || "Ismeretlen Oktató"}
                  </h3>
                  <p className="text-sm font-medium text-slate-400">
                    Írta: {review.authorName || "Anonymus"}
                  </p>
                </div>
                <div className="bg-[#F6C90E] px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm">
                  <span className="font-black text-slate-900">
                    {review.rating || 0}
                  </span>
                  <Star size={14} className="text-slate-900 fill-current" />
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl mb-4 flex-1">
                <p className="text-slate-700 italic line-clamp-3">
                  "{review.comment || "Nincs szöveges értékelés"}"
                </p>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      review.status === "approved"
                        ? "bg-green-500"
                        : review.status === "rejected"
                          ? "bg-red-500"
                          : "bg-yellow-400 animate-pulse"
                    }`}></span>
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    {review.status === "approved"
                      ? "Jóváhagyva"
                      : review.status === "rejected"
                        ? "Elutasítva"
                        : "Függőben"}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedReview(review);
                      setModalMode("view");
                      setShowModal(true);
                    }}
                    className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors">
                    <Eye size={18} />
                  </button>
                  {review.status !== "approved" && (
                    <button
                      onClick={() => handleApprove(review._id)}
                      className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors">
                      <CheckCircle size={18} />
                    </button>
                  )}
                  {review.status !== "rejected" && (
                    <button
                      onClick={() => {
                        setSelectedReview(review);
                        setModalMode("reject");
                        setShowModal(true);
                      }}
                      className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-colors">
                      <XCircle size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-[32px] p-12 text-center shadow-sm">
            <FileText size={48} className="mx-auto mb-4 text-slate-200" />
            <p className="text-slate-500 font-medium text-lg">
              Nincs értékelés
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedReview && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[32px] shadow-2xl max-w-lg w-full p-8 transform transition-all">
            {modalMode === "view" && (
              <>
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-black text-slate-900">
                    Értékelés Részletei
                  </h2>
                  <div className="bg-[#F6C90E] px-4 py-2 rounded-xl flex items-center gap-1">
                    <span className="font-black text-slate-900">
                      {selectedReview.rating || 0}
                    </span>
                    <Star size={16} className="text-slate-900 fill-current" />
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl mb-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-bold text-slate-400 uppercase">
                      Oktató
                    </span>
                    <span className="font-bold text-slate-900">
                      {selectedReview.instructorName || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-bold text-slate-400 uppercase">
                      Írta
                    </span>
                    <span className="font-bold text-slate-900">
                      {selectedReview.authorName || "Anonymus"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-bold text-slate-400 uppercase">
                      Dátum
                    </span>
                    <span className="font-bold text-slate-900">
                      {new Date(selectedReview.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="mb-8">
                  <span className="block text-sm font-bold text-slate-400 uppercase mb-2 ml-1">
                    Szöveg
                  </span>
                  <p className="bg-slate-100 p-6 rounded-2xl text-slate-700 italic">
                    "{selectedReview.comment || "Nincs komment"}"
                  </p>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="w-full px-4 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-colors shadow-lg">
                  Bezárás
                </button>
              </>
            )}

            {modalMode === "reject" && (
              <>
                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                  <XCircle size={32} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">
                  Értékelés Elutasítása
                </h2>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-500 ml-1 mb-2">
                    Indoklás (opcionális)
                  </label>
                  <textarea
                    id="rejectReason"
                    placeholder="Írd le az okot..."
                    rows="4"
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-medium focus:ring-2 focus:ring-orange-500 resize-none"></textarea>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors">
                    Mégse
                  </button>
                  <button
                    onClick={() =>
                      handleReject(
                        document.getElementById("rejectReason").value,
                      )
                    }
                    className="flex-1 px-4 py-4 bg-orange-500 text-white font-black rounded-2xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30">
                    Elutasítás
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

// Mock Star icon for reviews component since it wasn't in the import list originally
const Star = ({ size, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

export default AdminReviews;
