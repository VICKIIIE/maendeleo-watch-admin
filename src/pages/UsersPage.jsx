import React, { useState } from "react";
import { Search, Filter, Plus, X, MoreVertical, Shield, UserCheck, User, ShieldAlert, CheckCircle2, XCircle, Mail, Key, Activity, Calendar } from "lucide-react";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  
  // 🌟 NEW: State to track the clicked user
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({ name: "", email: "", role: "Auditor" });

  const [users, setUsers] = useState([
    { id: "USR-001", name: "System Admin", email: "admin@maendeleo.go.ke", role: "Super Admin", status: "Active", lastLogin: "Just now", dateAdded: "Jan 1, 2024" },
    { id: "USR-002", name: "Sarah K.", email: "sarah.k@maendeleo.go.ke", role: "Auditor", status: "Active", lastLogin: "2 hours ago", dateAdded: "Mar 15, 2024" },
    { id: "USR-003", name: "David M.", email: "david.m@maendeleo.go.ke", role: "Auditor", status: "Active", lastLogin: "Yesterday", dateAdded: "Apr 02, 2024" },
    { id: "USR-004", name: "James O.", email: "james.o@maendeleo.go.ke", role: "Field Agent", status: "Suspended", lastLogin: "2 weeks ago", dateAdded: "May 10, 2024" },
  ]);

  const handleAddUser = (e) => {
    e.preventDefault();
    const newUser = {
      id: `USR-00${users.length + 1}`,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: "Active",
      lastLogin: "Never",
      dateAdded: "Today"
    };
    setUsers([...users, newUser]);
    setIsModalOpen(false);
    setFormData({ name: "", email: "", role: "Auditor" });
  };

  const toggleSuspendUser = (id) => {
    if (id === "USR-001") {
      alert("Action Denied: You cannot suspend the primary Super Admin account.");
      return;
    }
    
    const updatedUsers = users.map(u => u.id === id ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" } : u);
    setUsers(updatedUsers);
    
    // Also update the panel if it's currently open
    if (selectedUser && selectedUser.id === id) {
      setSelectedUser({ ...selectedUser, status: selectedUser.status === "Active" ? "Suspended" : "Active" });
    }
    setActiveMenuId(null);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case "Super Admin": return <span className="flex items-center gap-1.5 text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md text-xs font-semibold border border-purple-100 w-max"><Shield className="w-3.5 h-3.5" /> Super Admin</span>;
      case "Auditor": return <span className="flex items-center gap-1.5 text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md text-xs font-semibold border border-blue-100 w-max"><UserCheck className="w-3.5 h-3.5" /> Auditor</span>;
      case "Field Agent": return <span className="flex items-center gap-1.5 text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md text-xs font-semibold border border-slate-200 w-max"><User className="w-3.5 h-3.5" /> Field Agent</span>;
      default: return role;
    }
  };

  const getStatusBadge = (status) => {
    return status === "Active" 
      ? <span className="flex items-center gap-1 text-emerald-600 text-sm font-medium"><CheckCircle2 className="w-4 h-4" /> Active</span>
      : <span className="flex items-center gap-1 text-red-500 text-sm font-medium"><XCircle className="w-4 h-4" /> Suspended</span>;
  };

  return (
    <div className="space-y-6 relative h-full" onClick={() => { setIsFilterOpen(false); setActiveMenuId(null); }}>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Users</h1>
          <p className="text-sm text-slate-500 mt-1">Manage administrator access, field agents, and auditors.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> Add New User
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search by name or email..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        
        <div className="relative">
          <button onClick={(e) => { e.stopPropagation(); setIsFilterOpen(!isFilterOpen); }} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition min-w-[160px] justify-between">
            <div className="flex items-center gap-2"><Filter className="w-4 h-4" /> {roleFilter === "All" ? "All Roles" : roleFilter}</div>
          </button>
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 shadow-lg rounded-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              {["All", "Super Admin", "Auditor", "Field Agent"].map((role) => (
                <button key={role} onClick={() => setRoleFilter(role)} className={`w-full text-left px-4 py-2 text-sm transition-colors ${roleFilter === role ? "bg-emerald-50 text-emerald-700 font-medium" : "text-slate-700 hover:bg-slate-50"}`}>{role}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-visible">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold">User Details</th>
                <th className="px-6 py-4 font-semibold">System Role</th>
                <th className="px-6 py-4 font-semibold">Account Status</th>
                <th className="px-6 py-4 font-semibold">Last Login</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredUsers.map((user) => (
                <tr 
                  key={user.id} 
                  // 🌟 WIRED: Clicking a row now opens the User Profile panel
                  onClick={() => setSelectedUser(user)} 
                  className={`hover:bg-slate-50 transition cursor-pointer ${user.status === 'Suspended' ? 'bg-slate-50/50' : ''}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${user.status === 'Suspended' ? 'bg-slate-200 text-slate-400' : 'bg-emerald-100 text-emerald-700'}`}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className={`font-semibold ${user.status === 'Suspended' ? 'text-slate-500' : 'text-slate-900'}`}>{user.name}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><Mail className="w-3 h-3"/> {user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                  <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                  <td className="px-6 py-4 text-slate-500">{user.lastLogin}</td>
                  <td className="px-6 py-4 text-right relative">
                    <button onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === user.id ? null : user.id); }} className="text-slate-400 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {activeMenuId === user.id && (
                      <div className="absolute right-8 top-12 w-48 bg-white border border-slate-200 shadow-lg rounded-xl overflow-hidden z-10">
                        <button onClick={(e) => { e.stopPropagation(); alert(`Editing ${user.name}`); setActiveMenuId(null); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">Edit Permissions</button>
                        <button onClick={(e) => { e.stopPropagation(); toggleSuspendUser(user.id); }} className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 border-t border-slate-100 ${user.status === 'Active' ? 'text-red-600 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50'}`}>
                          <ShieldAlert className="w-4 h-4" /> {user.status === "Active" ? "Suspend Account" : "Reactivate Account"}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🌟 NEW: SLIDE-OVER USER PROFILE PANEL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/20 backdrop-blur-sm transition-all">
          <div className="flex-1" onClick={() => setSelectedUser(null)}></div>
          
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Panel Header */}
            <div className="p-8 border-b border-slate-100 flex flex-col items-center text-center bg-slate-50 relative">
              <button onClick={() => setSelectedUser(null)} className="absolute top-6 right-6 p-2 bg-white rounded-full border border-slate-200 text-slate-400 hover:text-slate-700 shadow-sm transition">
                <X className="w-5 h-5" />
              </button>
              
              <div className={`w-24 h-24 rounded-full flex items-center justify-center font-bold text-3xl mb-4 shadow-sm ${selectedUser.status === 'Suspended' ? 'bg-slate-200 text-slate-400' : 'bg-emerald-100 text-emerald-700'}`}>
                {selectedUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{selectedUser.name}</h2>
              <p className="text-slate-500 text-sm mt-1">{selectedUser.email}</p>
              <div className="mt-4 flex gap-3">
                {getRoleBadge(selectedUser.role)}
                {getStatusBadge(selectedUser.status)}
              </div>
            </div>

            {/* Panel Body */}
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-6 p-5 bg-white border border-slate-100 rounded-xl shadow-sm">
                <div>
                  <div className="flex items-center gap-2 text-slate-500 mb-1"><Calendar className="w-4 h-4"/> <span className="text-xs font-semibold uppercase tracking-wider">Date Added</span></div>
                  <p className="text-slate-900 font-medium">{selectedUser.dateAdded}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-slate-500 mb-1"><Activity className="w-4 h-4"/> <span className="text-xs font-semibold uppercase tracking-wider">Last Login</span></div>
                  <p className="text-slate-900 font-medium">{selectedUser.lastLogin}</p>
                </div>
              </div>

              {/* Admin Actions Block */}
              <div className="bg-slate-900 p-5 rounded-xl text-white">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-emerald-500" /> Administrative Actions
                </h3>
                <p className="text-xs text-slate-400 mb-4">Manage this user's access to the command center.</p>
                
                <div className="space-y-2">
                  <button onClick={() => alert(`Password reset link sent to ${selectedUser.email}`)} className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 border border-slate-700">
                    <Key className="w-4 h-4" /> Send Password Reset
                  </button>
                  
                  <button 
                    onClick={() => toggleSuspendUser(selectedUser.id)}
                    className={`w-full py-2.5 px-3 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${
                      selectedUser.status === 'Active' ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
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

      {/* ADD USER MODAL (Unchanged) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">Invite New User</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-full border border-slate-200 shadow-sm"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label><input required type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Official Email</label><input required type="email" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">System Role</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none appearance-none" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                  <option value="Auditor">Auditor</option>
                  <option value="Field Agent">Field Agent</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl flex items-center gap-2"><Mail className="w-4 h-4"/> Send Invite</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}