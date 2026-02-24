import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./layouts/Layout.jsx";

const HomePage = lazy(() => import("./pages/Home.jsx"));
const InstructorProfile = lazy(() => import("./pages/InstructorProfile.jsx"));

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/instructor-profile" element={<InstructorProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
