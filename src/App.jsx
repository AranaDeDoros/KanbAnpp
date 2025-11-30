import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import ProjectsPage from "./pages/ProjectsPage";
import LoginPage from "./pages/LoginPage";
import {TokenProvider } from "./context/TokenProvider";
import CreateProjectPage from "./pages/CreateProjectPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Navbar } from "./components/Navbar";

const queryClient = new QueryClient();

function AppContent() {
  console.log("AppContent mounted");


  return (
    <div className="p-6">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/new"
          element={
            <ProtectedRoute>
              <CreateProjectPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <ProtectedRoute>
              <NotFoundPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TokenProvider>
          <Navbar />
          <AppContent />
        </TokenProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
