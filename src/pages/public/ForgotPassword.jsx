import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, AlertCircle, CheckCircle } from "lucide-react";
import { api } from "../../services/api/authService.js";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      setSuccess(true);
      setEmail("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to send reset email. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black px-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#F6C90E] mb-2">RAMI</h1>
          <h2 className="text-2xl font-semibold text-white">Reset Password</h2>
        </div>

        {/* Card */}
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
          {success ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-400" />
              </div>
              <p className="text-center text-gray-300">
                Password reset email sent! Check your inbox for instructions to
                reset your password.
              </p>
              <Link
                to="/login"
                className="block text-center bg-[#F6C90E] text-black font-semibold py-2 rounded-lg hover:bg-yellow-500 transition">
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-[#F6C90E] focus:ring-1 focus:ring-[#F6C90E]"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#F6C90E] text-black font-semibold py-2 rounded-lg hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Sending..." : "Send Reset Email"}
              </button>
            </form>
          )}

          {/* Links */}
          <div className="mt-6 pt-6 border-t border-gray-700 text-center space-y-2">
            <Link
              to="/login"
              className="text-[#F6C90E] hover:underline text-sm">
              Back to Login
            </Link>
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#F6C90E] hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
