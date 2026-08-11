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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="logs" element={<SystemLogsPage />} /> 
            
            <Route path="moderation" element={<ModerationPage />} />
            
            <Route path="*" element={<h1 className="text-3xl font-bold p-6">Module Coming Soon</h1>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}