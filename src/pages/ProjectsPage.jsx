import React, { useState } from "react";
import { Plus, Search, Filter, MoreVertical, AlertTriangle, CheckCircle2, Clock, X, Edit, Trash2, MapPin, DollarSign, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom"; // 🌟 NEW: Needed to click to other pages

export default function ProjectsPage() {
  const navigate = useNavigate(); // 🌟 NEW: Initialize the navigator

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [activeMenuId, setActiveMenuId] = useState(null); 
  const [selectedProject, setSelectedProject] = useState(null);

  const [formData, setFormData] = useState({ name: "", county: "", budget: "" });

  const mockProjects = [
    { id: "PRJ-001", name: "Nairobi Expressway Extension", county: "Nairobi", status: "Active", budget: "KSh 15.2B", riskScore: 12, contractor: "CRBC", startDate: "Jan 12, 2024" },
    { id: "PRJ-002", name: "Mombasa Port Expansion Phase 2", county: "Mombasa", status: "Delayed", budget: "KSh 32.0B", riskScore: 85, contractor: "KPA Engineering", startDate: "Mar 05, 2023" },
    { id: "PRJ-003", name: "Kisumu Water & Sanitation", county: "Kisumu", status: "Completed", budget: "KSh 4.5B", riskScore: 5, contractor: "Lake Basin Dev", startDate: "Nov 20, 2022" },
    { id: "PRJ-004", name: "Eldoret Bypass Road", county: "Uasin Gishu", status: "Active", budget: "KSh 6.1B", riskScore: 42, contractor: "KeNHA", startDate: "Feb 14, 2024" },
  ];

  const filteredProjects = mockProjects.filter((p) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.county.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active": return <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1 w-max"><Clock className="w-3 h-3"/> Active</span>;
      case "Completed": return <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium flex items-center gap-1 w-max"><CheckCircle2 className="w-3 h-3"/> Completed</span>;
      case "Delayed": return <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium flex items-center gap-1 w-max"><AlertTriangle className="w-3 h-3"/> Delayed</span>;
      default: return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Ready to send to Firebase:", formData);
    setIsModalOpen(false); 
    setFormData({ name: "", county: "", budget: "" }); 
  };

  return (
    <div className="space-y-6 relative h-full" onClick={() => setActiveMenuId(null)}>
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Project Database</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and monitor all national infrastructure projects.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> Add New Project
        </button>
      </div>

      {/* 🌟 RESTORED: SEARCH AND FILTERS */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, county, or ID..." 
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-visible">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold">ID</th>
                <th className="px-6 py-4 font-semibold">Project Name</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProjects.map((project) => (
                <tr key={project.id} onClick={() => setSelectedProject(project)} className="hover:bg-slate-50 transition cursor-pointer relative">
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{project.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{project.name}</td>
                  <td className="px-6 py-4 text-slate-600">{project.county}</td>
                  <td className="px-6 py-4">{getStatusBadge(project.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === project.id ? null : project.id); }} className="text-slate-400 hover:text-slate-900 p-1 rounded">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {activeMenuId === project.id && (
                      <div className="absolute right-8 top-10 w-36 bg-white border border-slate-200 shadow-lg rounded-xl overflow-hidden z-10">
                        <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"><Edit className="w-4 h-4 text-slate-400" /> Edit</button>
                        <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-slate-100"><Trash2 className="w-4 h-4 text-red-400" /> Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SLIDE-OVER DETAIL PANEL */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/20 backdrop-blur-sm transition-all">
          <div className="flex-1" onClick={() => setSelectedProject(null)}></div>
          
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
              <div>
                <p className="text-xs font-mono text-slate-500 mb-1">{selectedProject.id}</p>
                <h2 className="text-xl font-bold text-slate-900 leading-tight">{selectedProject.name}</h2>
                <div className="mt-3">{getStatusBadge(selectedProject.status)}</div>
              </div>
              <button onClick={() => setSelectedProject(null)} className="p-2 bg-white rounded-full border border-slate-200 text-slate-400 hover:text-slate-700 shadow-sm transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 text-slate-500 mb-1"><MapPin className="w-4 h-4"/> <span className="text-xs font-semibold uppercase tracking-wider">Location</span></div>
                  <p className="text-slate-900 font-medium">{selectedProject.county}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-slate-500 mb-1"><DollarSign className="w-4 h-4"/> <span className="text-xs font-semibold uppercase tracking-wider">Budget</span></div>
                  <p className="text-slate-900 font-medium">{selectedProject.budget}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-slate-500 mb-1"><Activity className="w-4 h-4"/> <span className="text-xs font-semibold uppercase tracking-wider">Risk Score</span></div>
                  <p className={`font-bold ${selectedProject.riskScore > 70 ? 'text-red-600' : selectedProject.riskScore > 30 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {selectedProject.riskScore} / 100
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-slate-500 mb-1"><Clock className="w-4 h-4"/> <span className="text-xs font-semibold uppercase tracking-wider">Started</span></div>
                  <p className="text-slate-900 font-medium">{selectedProject.startDate}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Lead Contractor</h3>
                <p className="text-slate-600 text-sm">{selectedProject.contractor}</p>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-white">
              {/* 🌟 NEW: Wire up the View Reports button! */}
              <button 
                onClick={() => navigate('/reports')}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-medium transition shadow-sm"
              >
                View Full Reports
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🌟 RESTORED: FULL ADD PROJECT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Register New Project</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
                <input required type="text" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Thika Road Expansion" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">County / Location</label>
                <input required type="text" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.county} onChange={(e) => setFormData({...formData, county: e.target.value})} placeholder="e.g. Kiambu" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Allocated Budget</label>
                <input required type="text" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} placeholder="e.g. KSh 2.5B" />
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg">Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}