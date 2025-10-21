import { lazy, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Navbar from "./components/Navbar.jsx";

const HomePage = lazy(() => import("./pages/Home.jsx"));
const LoginPage = lazy(() => import("./pages/Login.jsx"));
const RegisterPage = lazy(() => import("./pages/Register.jsx"));

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="home" element={<HomePage />} />
        <Route index path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />


        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
