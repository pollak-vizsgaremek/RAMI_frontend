import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./layouts/Layout.jsx";
import { AuthProvider } from "./context/AuthContext";

const HomePage = lazy(() => import("./pages/Home.jsx"));
const InstructorProfile = lazy(() => import("./pages/InstructorProfile.jsx"));
const BrowseInstructors = lazy(() => import("./pages/BrowseInstructors.jsx"));
const Leaderboard = lazy(() => import("./pages/Leaderboard.jsx"));
const UserProfile = lazy(() => import("./pages/UserProfile.jsx"))
const ReviewPage = lazy(() => import("./pages/Review.jsx"));
const ProfilePage = lazy(() => import("./pages/UserProfile.jsx"));

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/instructor/:id" element={<InstructorProfile />} />
            <Route path="/browse-instructors" element={<BrowseInstructors />} />
            <Route path="/instructor-profile" element={<InstructorProfile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/review" element={<ReviewPage />}></Route>
            <Route path="/profile" element={<ProfilePage />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
