import React, { useState, useEffect } from "react";
import { Search, Filter, AlertTriangle, CheckCircle2, Clock, X, MessageSquare, ShieldAlert, MapPin, Calendar, ExternalLink, ChevronDown, Download, UserCheck } from "lucide-react";
import api from '../api'; // 🌟 Importing your configured Axios instance
import { generatePDF } from '../utils/generatePDF';

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All"); 
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAudits = async () => { 
    try {
      setIsLoading(true);
      const response = await api.get('/audits');
      const rawData = response.data.data || response.data || [];
      
      const mappedReports = rawData.map(audit => ({
        ...audit,
        id: audit.id,
        project: audit.project_id || "Unknown Project",
        // Combine GPS into the "location" string your UI expects
        location: (audit.gps_latitude && audit.gps_longitude) 
            ? `${audit.gps_latitude}, ${audit.gps_longitude}` 
            : "No GPS coordinates provided",
        issue: audit.ground_status || "General Report",
        description: audit.comments || "No citizen narrative provided.",
        status: audit.verification_status || "Pending",
        urgency: "Medium",
        date: audit.created_at
      }));

      setReports(mappedReports);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits(); 
  }, []); 

  const handleAssignAuditor = async () => {
    const auditorName = window.prompt("Enter the name of the Auditor to assign:");
    if (!auditorName) return;

    try {
      const reportId = selectedReport.id || selectedReport.report_id;
      
      const updatePayload = {
        verification_status: "Investigating"
      };

      await api.put(`/audits/${reportId}`, updatePayload);

      const updatedAudit = { 
        ...selectedReport, 
        status: "Investigating", // UI uses 'status'
        auditor: auditorName 
      };
      
      setSelectedReport(updatedAudit);
      setReports(reports.map(r => (r.id === reportId || r.report_id === reportId) ? updatedAudit : r));
      
    } catch (error) {
      console.error("Failed to assign auditor:", error);
      alert("Error saving to database. Check connection.");
    }
  };

  const handleMarkResolved = async () => {
    try {
      const reportId = selectedReport.id || selectedReport.report_id;
      
      await api.put(`/audits/${reportId}`, { 
        verification_status: "Resolved" 
      });

      const updatedReport = { ...selectedReport, status: "Resolved" };
      setSelectedReport(updatedReport);
      setReports(reports.map(r => (r.id === reportId || r.report_id === reportId) ? updatedReport : r));
      
    } catch (error) {
      console.error("Failed to resolve report:", error);
      alert("Error saving to database. Check connection.");
    }
  };

  const handleExportCSV = () => {
    if (reports.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = ["Report ID", "Project", "Location", "Issue", "Urgency", "Status", "Assigned Auditor", "Date Submitted"];
    
    const csvRows = reports.map(r => 
      [
        r.id || r.report_id, 
        r.project || r.project_name, 
        r.location, 
        r.issue, 
        r.urgency, 
        r.status, 
        r.auditor || "Unassigned", 
        r.date || r.created_at ? new Date(r.date || r.created_at).toLocaleDateString() : 'N/A'
      ]
        .map(field => `"${field || ''}"`) // Wrap fields in quotes, handle nulls
        .join(",")
    );

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...csvRows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Maendeleo_Reports_Log.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredReports = reports.filter((r) => {
    const search = searchTerm.toLowerCase();
    const safeProject = r.project || r.project_name || "";
    const safeIssue = r.issue || "";
    const safeId = r.id || r.report_id || "";
    
    const matchesSearch = safeProject.toLowerCase().includes(search) || 
                          safeIssue.toLowerCase().includes(search) || 
                          String(safeId).toLowerCase().includes(search);
                          
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportPDF = () => {
    if (filteredReports.length === 0) {
      alert("No data available to export.");
      return;
    }

    generatePDF(
      "Maendeleo Citizen Reports",
      [
        { header: "Report ID", key: "id", format: (report) => String(report.id || report.report_id || "") },
        { header: "Project", key: "project", format: (report) => report.project || report.project_name || "" },
        { header: "Issue", key: "issue" },
        { header: "Urgency", key: "urgency" },
        { header: "Status", key: "status" },
        { header: "Auditor", key: "auditor", format: (report) => report.auditor || "Unassigned" },
        { header: "Date", key: "date", format: (report) => report.date || report.created_at || "N/A" },
      ],
      filteredReports,
      "maendeleo_reports_log"
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending": return <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium flex items-center gap-1 w-max"><Clock className="w-3 h-3"/> Pending Review</span>;
      case "Investigating": return <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1 w-max"><AlertTriangle className="w-3 h-3"/> Investigating</span>;
      case "Resolved": return <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium flex items-center gap-1 w-max"><CheckCircle2 className="w-3 h-3"/> Resolved</span>;
      default: return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case "Critical": return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold uppercase tracking-wider">Critical</span>;
      case "High": return <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-bold uppercase tracking-wider">High</span>;
      case "Medium": return <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold uppercase tracking-wider">Medium</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 relative h-full" onClick={() => setIsFilterOpen(false)}>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Citizen Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Review, assign, and resolve community-submitted infrastructure feedback.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleExportCSV}
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition shadow-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Report Log
          </button>
          <button 
            onClick={handleExportPDF}
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition shadow-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search reports..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        
        <div className="relative">
          <button onClick={(e) => { e.stopPropagation(); setIsFilterOpen(!isFilterOpen); }} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition min-w-[160px] justify-between">
            <div className="flex items-center gap-2"><Filter className="w-4 h-4" /> {statusFilter === "All" ? "All Statuses" : statusFilter}</div>
            <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
          </button>
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 shadow-lg rounded-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              {["All", "Pending", "Investigating", "Resolved"].map((status) => (
                <button key={status} onClick={() => setStatusFilter(status)} className={`w-full text-left px-4 py-2 text-sm transition-colors ${statusFilter === status ? "bg-emerald-50 text-emerald-700 font-medium" : "text-slate-700 hover:bg-slate-50"}`}>{status}</button>
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
                <th className="px-6 py-4 font-semibold">Report ID</th>
                <th className="px-6 py-4 font-semibold">Related Project</th>
                <th className="px-6 py-4 font-semibold">Reported Issue</th>
                <th className="px-6 py-4 font-semibold">Urgency</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Photo</th>
                <th className="px-6 py-4 font-semibold text-right">Date Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-slate-500 font-medium">Loading reports from database...</td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-slate-500">No reports found matching your search criteria.</td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id || report.report_id} onClick={() => setSelectedReport(report)} className="hover:bg-slate-50 transition cursor-pointer">
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{String(report.id || report.report_id).substring(0,8)}...</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{report.project || report.project_name}</td>
                    <td className="px-6 py-4 text-slate-600 truncate max-w-[200px]">{report.issue}</td>
                    <td className="px-6 py-4">{getUrgencyBadge(report.urgency)}</td>
                    <td className="px-6 py-4">{getStatusBadge(report.status)}</td>
                    <td className="px-6 py-4">
                      {report.image_url ? (
                        <a href={report.image_url} target="_blank" rel="noopener noreferrer">
                          <img
                            src={report.image_url}
                            alt="Ground Evidence"
                            style={{ width: "60px", height: "60px", borderRadius: "8px", objectFit: "cover" }}
                          />
                        </a>
                      ) : (
                        <span style={{ color: "#94A3B8", fontSize: "12px" }}>No Photo</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-right">{report.date || (report.created_at ? new Date(report.created_at).toLocaleDateString() : 'N/A')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedReport && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/20 backdrop-blur-sm transition-all">
          <div className="flex-1" onClick={() => setSelectedReport(null)}></div>
          
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <p className="text-xs font-mono text-slate-500">{selectedReport.id || selectedReport.report_id}</p>
                  {getUrgencyBadge(selectedReport.urgency)}
                </div>
                <h2 className="text-xl font-bold text-slate-900 leading-tight">{selectedReport.issue}</h2>
              </div>
              <button onClick={() => setSelectedReport(null)} className="p-2 bg-white rounded-full border border-slate-200 text-slate-400 hover:text-slate-700 shadow-sm transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <ExternalLink className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Related Project</p>
                    <p className="text-sm font-medium text-emerald-600 hover:underline cursor-pointer">{selectedReport.project || selectedReport.project_name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Specific Location</p>
                    <p className="text-sm text-slate-900">{selectedReport.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Submitted On</p>
                    <p className="text-sm text-slate-900">{selectedReport.date || (selectedReport.created_at ? new Date(selectedReport.created_at).toLocaleDateString() : 'N/A')} by <span className="font-medium">{selectedReport.citizen || 'Anonymous'}</span></p>
                  </div>
                </div>
                
                {selectedReport.auditor && (
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100 mt-2">
                    <UserCheck className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Assigned Field Auditor</p>
                      <p className="text-sm text-slate-900 font-bold">{selectedReport.auditor}</p>
                    </div>
                  </div>
                )}
              </div>

              <hr className="border-slate-100" />

              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-slate-400" /> Citizen Narrative</h3>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-700 leading-relaxed">"{selectedReport.description}"</div>
              </div>

              <div className="bg-slate-900 p-5 rounded-xl text-white">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-emerald-500" /> Admin Action Required</h3>
                <p className="text-xs text-slate-400 mb-4">Current Status: <span className="font-semibold text-white">{selectedReport.status}</span></p>
                <div className="grid grid-cols-2 gap-2">
                  
                  <button 
                    onClick={handleAssignAuditor} 
                    disabled={selectedReport.status === "Resolved"} 
                    className="py-2 px-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-xs font-medium transition text-center border border-slate-700"
                  >
                    {selectedReport.auditor ? "Reassign Auditor" : "Assign Auditor"}
                  </button>
                  
                  <button 
                    onClick={handleMarkResolved} 
                    disabled={selectedReport.status === "Resolved"} 
                    className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-xs font-medium transition text-center"
                  >
                    Mark Resolved
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