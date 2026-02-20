import { Suspense } from "react";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-800 bg-linear-to-br from-gray-900 via-gray-500 to-gray-300">
      <Suspense fallback={<div className="p-20 text-center">Loading...</div>}>
        <Outlet />
      </Suspense>
    </div>
  );
}
