import React from "react";
import { Navigate, Outlet } from "react-router";
//import { decodeJwt } from "../utils/jwt";

export default function ProtectedRoute() {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) return <Navigate to="/" replace />;

  const decoded = decodeJwt(accessToken);

  if (!decoded) return <Navigate to="/" replace />;

  return <Outlet />;
}
