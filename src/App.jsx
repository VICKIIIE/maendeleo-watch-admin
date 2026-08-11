import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage"; 
import ProjectsPage from "./pages/ProjectsPage";
import ReportsPage from "./pages/ReportsPage";
import UsersPage from "./pages/UsersPage";
import SettingsPage from "./pages/SettingsPage";
import SystemLogsPage from './pages/SystemLogsPage';
import ModerationPage from './pages/ModerationPage'; // <-- 1. Import the new page
import UnauthorizedPage from './pages/UnauthorizedPage';

const allRoles = ["Super Admin", "Project Manager", "Field Agent", "Moderator", "Investigator"];
const projectRoles = ["Super Admin", "Project Manager", "Field Agent", "Investigator"];
const reportRoles = ["Super Admin", "Project Manager", "Field Agent", "Moderator", "Investigator"];
const moderationRoles = ["Super Admin", "Moderator", "Investigator"];
const systemRoles = ["Super Admin", "Investigator"];
const adminOnlyRoles = ["Super Admin"];

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route element={<ProtectedRoute allowedRoles={allRoles} />}>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route element={<ProtectedRoute allowedRoles={projectRoles} />}>
              <Route path="projects" element={<ProjectsPage />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={reportRoles} />}>
              <Route path="reports" element={<ReportsPage />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={adminOnlyRoles} />}>
              <Route path="users" element={<UsersPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={systemRoles} />}>
              <Route path="logs" element={<SystemLogsPage />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={moderationRoles} />}>
              <Route path="moderation" element={<ModerationPage />} />
            </Route>
            
            <Route path="*" element={<h1 className="text-3xl font-bold p-6">Module Coming Soon</h1>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}