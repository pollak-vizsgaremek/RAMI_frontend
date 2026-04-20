import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import { BrowserRouter, Routes, Route } from "react-router";
import MainLayout from "./components/common/MainLayout.jsx";
import AdminLayout from "./components/common/AdminLayout.jsx";
import AdminProtectedRoute from "./guards/AdminProtectedRoute.jsx";
import { AuthProvider } from "./context/AuthContext";

// Public Pages
const HomePage = lazy(() => import("./pages/public/Home.jsx"));
const BrowseInstructors = lazy(
  () => import("./pages/public/BrowseInstructors.jsx"),
);
const Leaderboard = lazy(() => import("./pages/public/Leaderboard.jsx"));
const Login = lazy(() => import("./pages/public/Login.jsx"));
const Register = lazy(() => import("./pages/public/Register.jsx"));
const RegisterInstructor = lazy(() => import("./pages/public/RegisterInstructor.jsx"));
const Review = lazy(() => import("./pages/public/Review.jsx"));
const ForgotPassword = lazy(() => import("./pages/public/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("./pages/public/ResetPassword.jsx"));

// Instructor Pages
const InstructorProfile = lazy(
  () => import("./pages/instructor/InstructorProfile.jsx"),
);
const InstructorSearch = lazy(
  () => import("./pages/public/InstructorSearch.jsx"),
);
const UserProfile = lazy(() => import("./pages/instructor/UserProfile.jsx"));

// Admin Pages
const AdminRegister = lazy(() => import("./pages/admin/AdminRegister.jsx"));
const AdminLanding = lazy(() => import("./pages/admin/AdminLanding.jsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.jsx"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers.jsx"));
const AdminInstructors = lazy(
  () => import("./pages/admin/AdminInstructors.jsx"),
);
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews.jsx"));
const AdminReports = lazy(() => import("./pages/admin/AdminReports.jsx"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings.jsx"));

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F6C90E]"></div>
          </div>
        }>
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/instructor/:id" element={<InstructorProfile />} />
            <Route path="/browse-instructors" element={<BrowseInstructors />} />
            <Route path="/instructor-search" element={<InstructorSearch />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/review" element={<Review />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-instructor" element={<RegisterInstructor />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          {/* Admin Registration (Standalone) */}
          <Route path="/admin/register" element={<AdminRegister />} />

          {/* Admin Landing Page (Protected) */}
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLanding />
              </AdminProtectedRoute>
            }
          />

          {/* Admin Routes with Layout (Protected) */}
          <Route
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/instructors" element={<AdminInstructors />} />
            <Route path="/admin/reviews" element={<AdminReviews />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  </AuthProvider>,
);
