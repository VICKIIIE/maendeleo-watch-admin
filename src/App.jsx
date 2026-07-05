import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout & Routing
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

// Pages
import LoginPage from "./pages/LoginPage";
// 🌟 CHANGED: Now importing the correct DashboardPage we just built!
import DashboardPage from "./pages/DashboardPage"; 
import ProjectsPage from "./pages/ProjectsPage";
import ReportsPage from "./pages/ReportsPage";
import UsersPage from "./pages/UsersPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTE - Anyone can see this */}
        <Route path="/login" element={<LoginPage />} />

        {/* 🛡️ PROTECTED ADMIN ROUTES - Only logged-in users can see these */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AdminLayout />}>
            {/* 🌟 CHANGED: Now rendering the DashboardPage */}
            <Route index element={<DashboardPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<h1 className="text-3xl font-bold p-6">Module Coming Soon</h1>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}