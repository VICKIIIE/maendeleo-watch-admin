import React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { FolderKanban, LayoutDashboard, FileText, Users, Settings, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation(); 

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const navLinks = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Projects", path: "/projects", icon: FolderKanban },
    { name: "Reports", path: "/reports", icon: FileText },
    { name: "Users", path: "/users", icon: Users },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-emerald-500 tracking-wider">MAENDELEO</h2>
          <p className="text-xs text-slate-400">Command Center</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path; 
            
            return (
              <Link 
                key={link.name}
                to={link.path} 
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* BOTTOM SIDEBAR ACTIONS */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link 
            to="/settings" 
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
              location.pathname === '/settings' 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Settings className={`w-5 h-5 ${location.pathname === '/settings' ? 'text-white' : 'text-slate-400'}`} />
            <span>Settings</span>
          </Link>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 justify-between shadow-sm z-10">
          <h1 className="text-lg font-semibold text-slate-800 capitalize">
            {location.pathname === '/' ? 'Overview' : location.pathname.substring(1)}
          </h1>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-500">System Admin</span>
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
              SA
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}