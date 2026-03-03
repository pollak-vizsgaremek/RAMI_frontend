import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./layouts/Layout.jsx";
import { AuthProvider } from "./context/AuthContext";

const HomePage = lazy(() => import("./pages/Home.jsx"));
const InstructorProfile = lazy(() => import("./pages/InstructorProfile.jsx"));
const UserProfile = lazy(() => import("./pages/UserProfile.jsx"))

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/instructor-profile" element={<InstructorProfile />} />
            <Route path="/user-profile" element={<UserProfile/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
