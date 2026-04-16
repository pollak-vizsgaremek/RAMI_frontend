import React, { useState, useEffect } from "react";
import {
  Search,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  MessageSquare,
} from "lucide-react";
import {
  getReviewsList,
  approveReview,
  rejectReview,
  deleteReview,
} from "../services/api/adminService";
import { toast } from "react-toastify";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, pending, approved, rejected
  const [selectedReview, setSelectedReview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("view"); // view, reject

  useEffect(() => {
    fetchReviews();
  }, [filterStatus]);

  const fetchReviews = async () => {
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
  };

  const handleApprove = async (reviewId) => {
    try {
      await approveReview(reviewId);
      toast.success("Review approved successfully");
      fetchReviews();
    } catch (error) {
      toast.error(error.message || "Failed to approve review");
    }
  };

  const handleReject = async (reason) => {
    try {
      await rejectReview(selectedReview._id, reason);
      toast.success("Review rejected successfully");
      setShowModal(false);
      fetchReviews();
    } catch (error) {
      toast.error(error.message || "Failed to reject review");
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }
    try {
      await deleteReview(reviewId);
      toast.success("Review deleted successfully");
      fetchReviews();
    } catch (error) {
      toast.error(error.message || "Failed to delete review");
    }
  };

  const filteredReviews = reviews.filter(
    (review) =>
      review.instructorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.authorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusBadge = (status) => {
    const badges = {
      approved: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Approved",
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Pending",
      },
      rejected: { bg: "bg-red-100", text: "text-red-800", label: "Rejected" },
    };
    const badge = badges[status] || badges.pending;
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
        <h1 className="text-3xl font-bold text-gray-900">Reviews Moderation</h1>
        <p className="text-gray-600 mt-1">
          Review and moderate instructor reviews before they go live.
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
              placeholder="Search by instructor, author, or content..."
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
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Reviews Cards */}
      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    {review.instructorName || "Unknown Instructor"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    by {review.authorName || "Anonymous"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(review.status || "pending")}
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    ★ {review.rating || 0}/5
                  </span>
                </div>
              </div>

              <p className="text-gray-700 mb-4 line-clamp-2">
                {review.comment || "No comment provided"}
              </p>

              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                {review.flagged && (
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold">
                    ⚠️ Flagged
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedReview(review);
                    setModalMode("view");
                    setShowModal(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition inline-block border border-blue-200">
                  <Eye size={18} />
                </button>
                {review.status !== "approved" && (
                  <button
                    onClick={() => handleApprove(review._id)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition inline-block border border-green-200">
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
                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition inline-block border border-orange-200">
                    <XCircle size={18} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(review._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition inline-block border border-red-200">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
            No reviews found
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto p-6">
            {modalMode === "view" && (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Review Details
                </h2>
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Instructor
                      </label>
                      <p className="mt-1 text-gray-900">
                        {selectedReview.instructorName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Author
                      </label>
                      <p className="mt-1 text-gray-900">
                        {selectedReview.authorName || "Anonymous"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Rating
                      </label>
                      <p className="mt-1 text-gray-900">
                        ★ {selectedReview.rating || 0}/5
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Date
                      </label>
                      <p className="mt-1 text-gray-900">
                        {new Date(
                          selectedReview.createdAt,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Review
                    </label>
                    <p className="mt-1 text-gray-700 p-3 bg-gray-50 rounded">
                      {selectedReview.comment || "No comment"}
                    </p>
                  </div>
                  {selectedReview.flagged && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded">
                      <p className="text-sm text-red-700">
                        <strong>Flagged Reason:</strong>{" "}
                        {selectedReview.flagReason || "Content violation"}
                      </p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full px-4 py-2 bg-[#F6C90E] text-black font-semibold rounded-lg hover:bg-[#E6B90D] transition">
                  Close
                </button>
              </>
            )}

            {modalMode === "reject" && (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Reject Review
                </h2>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to reject this review?
                </p>
                <div className="bg-gray-50 p-3 rounded mb-4 max-h-24 overflow-y-auto">
                  <p className="text-sm text-gray-700">
                    {selectedReview.comment}
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Reason for rejection
                  </label>
                  <textarea
                    placeholder="e.g., Inappropriate language, Off-topic, Spam..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C90E]"
                    rows="3"
                    id="rejectReason"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const reason =
                        document.getElementById("rejectReason").value;
                      handleReject(reason);
                    }}
                    className="flex-1 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition">
                    Reject Review
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

export default AdminReviews;
