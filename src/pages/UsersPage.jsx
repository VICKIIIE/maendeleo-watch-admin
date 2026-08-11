import React, { useState, useEffect } from "react";
import { X, MoreVertical, Shield, UserCheck, User, ShieldAlert, CheckCircle2, XCircle, Mail, Activity, Calendar, Loader2, ArrowRightLeft, Download } from "lucide-react";
import axios from "axios";
import { generatePDF } from '../utils/generatePDF';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // New state to toggle the role selection menu
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/users');
      
      if (response.data.success) {
        const formattedUsers = response.data.data.map(user => ({
          id: user.id,
          name: user.name || user.fullname || user.username || "Unknown",
          email: user.email || "No Email",
          role: user.role || "Citizen",
          status: user.status || "Active",
          lastLogin: user.last_login ? new Date(user.last_login).toLocaleDateString() : "Never",
          dateAdded: user.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown"
        }));
        
        setUsers(formattedUsers);
      } else {
        setError("Failed to load system users.");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Network error: Failed to connect to server.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- FULLY FUNCTIONAL SUSPEND ACTION ---
  const toggleSuspendUser = async (id) => {
    try {
      const targetUser = users.find(u => u.id === id);
      const newStatus = targetUser.status === "Active" ? "Suspended" : "Active";
      
      // Hit the backend endpoint
      await axios.patch(`http://localhost:3000/api/users/${id}/status`, { status: newStatus });

      // Update UI state
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
      if (selectedUser?.id === id) {
        setSelectedUser(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert("Failed to update user status. Check database connection.");
    } finally {
      setActiveMenuId(null);
    }
  };

  // --- FULLY FUNCTIONAL ROLE CHANGE ACTION ---
  const changeUserRole = async (id, newRole) => {
    try {
      // Hit the new backend endpoint
      await axios.patch(`http://localhost:3000/api/users/${id}/role`, { role: newRole });

      // Update UI state
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
      if (selectedUser?.id === id) {
        setSelectedUser(prev => ({ ...prev, role: newRole }));
      }
      setShowRoleSelector(false); // Hide the menu after success
    } catch (err) {
      alert("Failed to change user role.");
    }
  };

  // UI HELPERS
  const getRoleBadge = (role) => {
    switch (role) {
      case "Super Admin": return <span className="flex items-center gap-1.5 text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md text-xs font-semibold border border-purple-100 w-max"><Shield className="w-3.5 h-3.5" /> Super Admin</span>;
      case "Auditor": return <span className="flex items-center gap-1.5 text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md text-xs font-semibold border border-blue-100 w-max"><UserCheck className="w-3.5 h-3.5" /> Auditor</span>;
      case "Field Agent": return <span className="flex items-center gap-1.5 text-orange-700 bg-orange-50 px-2.5 py-1 rounded-md text-xs font-semibold border border-orange-100 w-max"><Activity className="w-3.5 h-3.5" /> Field Agent</span>;
      default: return <span className="flex items-center gap-1.5 text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md text-xs font-semibold border border-slate-200 w-max"><User className="w-3.5 h-3.5" /> {role || 'Citizen'}</span>;
    }
  };

  const getStatusBadge = (status) => {
    return status === "Active" 
      ? <span className="flex items-center gap-1 text-emerald-600 text-sm font-medium"><CheckCircle2 className="w-4 h-4" /> Active</span>
      : <span className="flex items-center gap-1 text-red-500 text-sm font-medium"><XCircle className="w-4 h-4" /> Suspended</span>;
  };

  const handleExportPDF = () => {
    if (users.length === 0) {
      alert("No users available to export.");
      return;
    }

    generatePDF(
      "Maendeleo System Users",
      [
        { header: "Name", key: "name" },
        { header: "Email", key: "email" },
        { header: "Role", key: "role" },
        { header: "Status", key: "status" },
        { header: "Last Login", key: "lastLogin" },
      ],
      users,
      "maendeleo_system_users"
    );
  };

  return (
    <div className="space-y-6 relative h-full" onClick={() => { setActiveMenuId(null); setShowRoleSelector(false); }}>
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Users</h1>
          <p className="text-sm text-slate-500 mt-1">Manage administrator access, field agents, and auditors.</p>
        </div>
        <button 
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm"
        >
          <Download className="w-4 h-4" /> Export PDF
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      {/* USERS TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-visible mt-6">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold">User Details</th>
                <th className="px-6 py-4 font-semibold">System Role</th>
                <th className="px-6 py-4 font-semibold">Account Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
                    <p className="text-slate-500">Loading users...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">No users found.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr 
                    key={user.id} 
                    onClick={(e) => { e.stopPropagation(); setSelectedUser(user); setShowRoleSelector(false); }} 
                    className={`hover:bg-slate-50 transition cursor-pointer ${user.status === 'Suspended' ? 'bg-slate-50/50' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${user.status === 'Suspended' ? 'bg-slate-200 text-slate-400' : 'bg-emerald-100 text-emerald-700'}`}>
                          {user.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className={`font-semibold ${user.status === 'Suspended' ? 'text-slate-500' : 'text-slate-900'}`}>{user.name}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><Mail className="w-3 h-3"/> {user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                    <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                    <td className="px-6 py-4 text-right relative">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === user.id ? null : user.id); }} 
                        className="text-slate-400 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      {/* QUICK ACTION MENU */}
                      {activeMenuId === user.id && (
                        <div className="absolute right-8 top-12 w-48 bg-white border border-slate-200 shadow-lg rounded-xl overflow-hidden z-10">
                          <button 
                            onClick={(e) => { e.stopPropagation(); toggleSuspendUser(user.id); }} 
                            className={`w-full text-left px-4 py-3 text-sm flex items-center gap-2 ${user.status === 'Active' ? 'text-red-600 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                          >
                            <ShieldAlert className="w-4 h-4" /> {user.status === "Active" ? "Suspend Account" : "Reactivate Account"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* USER PROFILE SIDE PANEL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/20 backdrop-blur-sm transition-all">
          <div className="flex-1" onClick={() => { setSelectedUser(null); setShowRoleSelector(false); }}></div>
          
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-8 border-b border-slate-100 flex flex-col items-center text-center bg-slate-50 relative">
              <button 
                onClick={() => { setSelectedUser(null); setShowRoleSelector(false); }} 
                className="absolute top-6 right-6 p-2 bg-white rounded-full border border-slate-200 text-slate-400 hover:text-slate-700 shadow-sm transition"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className={`w-24 h-24 rounded-full flex items-center justify-center font-bold text-3xl mb-4 shadow-sm ${selectedUser.status === 'Suspended' ? 'bg-slate-200 text-slate-400' : 'bg-emerald-100 text-emerald-700'}`}>
                {selectedUser.name.substring(0, 2).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{selectedUser.name}</h2>
              <p className="text-slate-500 text-sm mt-1">{selectedUser.email}</p>
              <div className="mt-4 flex gap-3">
                {getRoleBadge(selectedUser.role)}
                {getStatusBadge(selectedUser.status)}
              </div>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              
              {/* ADMINISTRATIVE ACTIONS SECTION */}
              <div className="bg-slate-900 p-5 rounded-xl text-white">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-emerald-500" /> Administrative Actions
                </h3>
                
                <div className="flex flex-col gap-3">
                  
                  {/* BUTTON 1: ROLE CHANGE */}
                  <div className="relative">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowRoleSelector(!showRoleSelector); }}
                      className="w-full py-2.5 px-3 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 bg-white/10 text-white hover:bg-white/20"
                    >
                      <ArrowRightLeft className="w-4 h-4" /> Change System Role
                    </button>
                    
                    {/* ROLE SELECTOR DROPDOWN */}
                    {showRoleSelector && (
                      <div className="mt-2 bg-slate-800 rounded-lg p-2 flex flex-col gap-1 border border-slate-700" onClick={(e) => e.stopPropagation()}>
                        {["Citizen", "Field Agent", "Auditor", "Super Admin"].map((roleOption) => (
                          <button
                            key={roleOption}
                            disabled={selectedUser.role === roleOption}
                            onClick={() => changeUserRole(selectedUser.id, roleOption)}
                            className={`text-left px-3 py-2 rounded-md text-sm transition ${
                              selectedUser.role === roleOption 
                                ? 'bg-emerald-500/20 text-emerald-400 cursor-not-allowed' 
                                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                            }`}
                          >
                            {roleOption} {selectedUser.role === roleOption && "(Current)"}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* BUTTON 2: SUSPEND/REACTIVATE */}
                  <button 
                    onClick={() => toggleSuspendUser(selectedUser.id)}
                    className={`w-full py-2.5 px-3 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${
                      selectedUser.status === 'Active' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4" /> 
                    {selectedUser.status === 'Active' ? 'Suspend Account Access' : 'Reactivate Account'}
                  </button>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}