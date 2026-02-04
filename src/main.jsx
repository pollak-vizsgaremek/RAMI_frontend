import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";

const HomePage = lazy(() => import("./pages/Home.jsx"));

function App() {
  return (
    <div className="min-h-screen bg-gray-800 bg-linear-to-br from-gray-900 via-gray-500 to-gray-300">
      <Suspense fallback={<div className="p-20 text-center">Loading...</div>}>
        <HomePage />
      </Suspense>
    </div>
  );
}

export default App;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
