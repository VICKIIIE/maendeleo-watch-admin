import { useState, useEffect } from "react";
import { Plus, Search, MoreVertical, AlertTriangle, CheckCircle2, Clock, X, Edit, Trash2, MapPin, DollarSign, Activity, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from '../api';
import { generatePDF } from '../utils/generatePDF';
import { useAuth } from "../context/AuthContext";
import { hasAnyRole } from "../utils/rbac";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const canManageProjects = hasAnyRole(role, ["Super Admin", "Project Manager"]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [activeMenuId, setActiveMenuId] = useState(null); 
  const [selectedProject, setSelectedProject] = useState(null);

  // Replace your existing formData state with this:
  const [formData, setFormData] = useState({ 
    name: "", 
    county_id: "", 
    constituency_id: "", 
    budget: "", 
    lat: "", 
    lng: "" 
  });

  // Add these two new states to store the dropdown options:
  const [countiesList, setCountiesList] = useState([]);
  const [constituenciesList, setConstituenciesList] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);

  const handleEditProject = (project, e) => {
    if (!canManageProjects) return;
    e.stopPropagation(); 
    setEditingId(project.id);
    setFormData({
      name: project.name || "",
      county_id: project.county_id || "",
      constituency_id: project.constituency_id || "",
      budget: project.budget_allocated || "",
      lat: project.latitude || "",
      lng: project.longitude || ""
    });
    setIsModalOpen(true);
    setActiveMenuId(null); 
  };

  const handleDeleteProject = async (id, e) => {
    if (!canManageProjects) return;
    e.stopPropagation(); 
    if (window.confirm("Are you sure you want to permanently delete this project?")) {
      try {
        await api.delete(`/projects/${id}`);
        fetchProjects();
        setActiveMenuId(null);
      } catch (error) {
        console.error("Failed to delete:", error);
        alert("Failed to delete project.");
      }
    }
  };
  
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/projects');
      setProjects(response.data.data);
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // 1. Fetch all counties when the page loads
  useEffect(() => {
    const fetchCounties = async () => {
      try {
        const response = await api.get('/locations/counties');
        // Assuming your backend returns { data: [...] }
        setCountiesList(response.data.data || response.data); 
      } catch (error) {
        console.error("Failed to fetch counties:", error);
      }
    };
    fetchCounties();
  }, []);

  // 2. Fetch constituencies dynamically whenever formData.county_id changes
  useEffect(() => {
    if (formData.county_id) {
      const fetchConstituencies = async () => {
        try {
          const response = await api.get(`/locations/counties/${formData.county_id}/constituencies`);
          setConstituenciesList(response.data.data || response.data);
        } catch (error) {
          console.error("Failed to fetch constituencies:", error);
        }
      };
      fetchConstituencies();
    }
  }, [formData.county_id]);

  const filteredProjects = projects.filter((p) => {
    const safeName = p.name || "";
    const safeCounty = p.county || "";
    const matchSearch = safeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        safeCounty.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = statusFilter === "All" || (p.status || "").toLowerCase() === statusFilter.toLowerCase();
    
    return matchSearch && matchStatus;
  });

  const handleExportPDF = () => {
    if (filteredProjects.length === 0) {
      alert("No projects available to export.");
      return;
    }

    generatePDF(
      "Maendeleo Projects Report",
      [
        { header: "ID", key: "id", format: (project) => project.id?.substring(0, 8) || "N/A" },
        { header: "Project Name", key: "name" },
        { header: "Location", key: "county" },
        { header: "Status", key: "status" },
      ],
      filteredProjects,
      "maendeleo_projects_report"
    );
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "active": return <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1 w-max"><Clock className="w-3 h-3"/> Active</span>;
      case "completed": return <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium flex items-center gap-1 w-max"><CheckCircle2 className="w-3 h-3"/> Completed</span>;
      case "delayed": return <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium flex items-center gap-1 w-max"><AlertTriangle className="w-3 h-3"/> Delayed</span>;
      default: return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium capitalize">{status || 'Planned'}</span>;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("1. Form submit started!"); // <-- ADD THIS

    try {
      const numericBudget = String(formData.budget).replace(/[^0-9.]/g, '');

      const newProjectPayload = {
        name: formData.name, 
        county_id: formData.county_id,             // <-- Updated
        constituency_id: formData.constituency_id, // <-- Updated
        budget_allocated: numericBudget,
        category: "Infrastructure", 
        status: "active",
        description: "Updated via admin portal",
        ward: "TBD", // You can add a 3rd dropdown for this later!                
        latitude: parseFloat(formData.lat) || 0, 
        longitude: parseFloat(formData.lng) || 0 
      };

      console.log("2. Payload ready, sending to API...", newProjectPayload); // <-- ADD THIS

      if (editingId) {
        await api.put(`/projects/${editingId}`, newProjectPayload);
      } else {
        await api.post('/projects', newProjectPayload);
      }   
      
      setIsModalOpen(false); 
      setEditingId(null); 
      setFormData({ 
        name: "", 
        county_id: "", 
        constituency_id: "", 
        budget: "", 
        lat: "", 
        lng: "" 
      }); 
      setConstituenciesList([]);
      fetchProjects(); 
      
    } catch (error) {
      console.error("Failed to save project:", error);
      alert("Failed to save project. Check console for details.");
    }
  };

  return (
    <div className="space-y-6 relative h-full" onClick={() => setActiveMenuId(null)}>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Project Database</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and monitor all national infrastructure projects.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleExportPDF} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition shadow-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Export PDF
          </button>
          {canManageProjects && (
            <button onClick={() => { setEditingId(null); setFormData({ name: "", county_id: "", constituency_id: "", budget: "", lat: "", lng: "" }); setConstituenciesList([]); setIsModalOpen(true); }} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm">
              <Plus className="w-4 h-4" /> Add New Project
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, county..." 
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <select 
          className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition cursor-pointer"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="delayed">Delayed</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-visible">
        <div className="overflow-x-auto min-h-[300px]">
          {isLoading ? (
             <div className="flex justify-center items-center h-64 text-slate-500">
               Loading actual projects from database...
             </div>
          ) : (
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
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No projects found. Add one!</td>
                  </tr>
                ) : (
                  filteredProjects.map((project) => (
                    <tr key={project.id} onClick={() => setSelectedProject(project)} className="hover:bg-slate-50 transition cursor-pointer relative">
                      <td className="px-6 py-4 text-slate-500 font-mono text-xs">{project.id.substring(0, 8)}...</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{project.name}</td>
                      <td className="px-6 py-4 text-slate-600">{project.county}</td>
                      <td className="px-6 py-4">{getStatusBadge(project.status)}</td>
                      <td className="px-6 py-4 text-right">
                        {canManageProjects && (
                          <>
                            <button onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === project.id ? null : project.id); }} className="text-slate-400 hover:text-slate-900 p-1 rounded">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                            {activeMenuId === project.id && (
                              <div className="absolute right-8 top-10 w-36 bg-white border border-slate-200 shadow-lg rounded-xl overflow-hidden z-10">
                                <button onClick={(e) => handleEditProject(project, e)} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"><Edit className="w-4 h-4 text-slate-400" /> Edit</button>
                                <button onClick={(e) => handleDeleteProject(project.id, e)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-slate-100"><Trash2 className="w-4 h-4 text-red-400" /> Delete</button>
                              </div>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/20 backdrop-blur-sm transition-all">
          <div className="flex-1" onClick={() => setSelectedProject(null)}></div>
          
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
              <div>
                <p className="text-xs font-mono text-slate-500 mb-1">{selectedProject.id}</p>
                <h2 className="text-xl font-bold text-slate-900 leading-tight">{selectedProject.title}</h2>
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
                  <p className="text-slate-900 font-medium">{selectedProject.location_id || 'N/A'}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-slate-500 mb-1"><DollarSign className="w-4 h-4"/> <span className="text-xs font-semibold uppercase tracking-wider">Budget</span></div>
                  <p className="text-slate-900 font-medium">{selectedProject.budget || 'Pending'}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-slate-500 mb-1"><Activity className="w-4 h-4"/> <span className="text-xs font-semibold uppercase tracking-wider">Risk Score</span></div>
                  <p className={`font-bold ${selectedProject.riskScore > 70 ? 'text-red-600' : selectedProject.riskScore > 30 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {selectedProject.riskScore || 0} / 100
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-slate-500 mb-1"><Clock className="w-4 h-4"/> <span className="text-xs font-semibold uppercase tracking-wider">Started</span></div>
                  <p className="text-slate-900 font-medium">{new Date(selectedProject.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Lead Contractor</h3>
                <p className="text-slate-600 text-sm">{selectedProject.contractor || 'Awaiting Assignment'}</p>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-white">
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
                <label className="block text-sm font-medium text-slate-700 mb-1">County</label>
                <select 
                  required 
                  className="w-full px-4 py-2 bg-slate-50 text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer" 
                  value={formData.county_id} 
                  onChange={(e) => setFormData({
                    ...formData, 
                    county_id: e.target.value, 
                    constituency_id: ""
                  })}
                >
                  <option value="" disabled className="text-slate-500">Select a County</option>
                  {countiesList.map(county => (
                    <option key={county.id} value={county.id} className="text-slate-900">
                      {county.county_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Constituency Dropdown */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Constituency</label>
                <select 
                  required 
                  disabled={!formData.county_id} 
                  className="w-full px-4 py-2 bg-slate-50 text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                  value={formData.constituency_id} 
                  onChange={(e) => setFormData({...formData, constituency_id: e.target.value})}
                >
                  <option value="" disabled className="text-slate-500">
                    {!formData.county_id ? "Select a County first" : "Select a Constituency"}
                  </option>
                  {constituenciesList.map(constituency => (
                    <option key={constituency.id} value={constituency.id} className="text-slate-900">
                      {constituency.constituency_name} {/* <-- Changed from constituency.name */}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Allocated Budget</label>
                <input required type="text" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} placeholder="e.g. KSh 2.5B" />
              </div>

              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Latitude</label>
                  <input 
                    required 
                    type="number" 
                    step="any" 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                    value={formData.lat} 
                    onChange={(e) => setFormData({...formData, lat: e.target.value})} 
                    placeholder="e.g. -1.1018" 
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Longitude</label>
                  <input 
                    required 
                    type="number" 
                    step="any" 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                    value={formData.lng} 
                    onChange={(e) => setFormData({...formData, lng: e.target.value})} 
                    placeholder="e.g. 37.0144" 
                  />
                </div>
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