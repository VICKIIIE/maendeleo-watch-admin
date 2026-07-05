import React, { useState } from "react";
import { Search, Filter, AlertTriangle, CheckCircle2, Clock, X, MessageSquare, ShieldAlert, MapPin, Calendar, ExternalLink, ChevronDown, Download, UserCheck } from "lucide-react";

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All"); 
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 🌟 UPGRADED DATA: Added 'auditor' field to track who is on the job
  const [reports, setReports] = useState([
    { id: "RPT-842", project: "Nairobi Expressway Extension", location: "Exit 4, Westlands", issue: "Severe structural cracking on pillar 12.", citizen: "Anonymous", status: "Investigating", urgency: "Critical", date: "Jul 2, 2026", description: "I drive past this pillar every day and the crack has widened significantly over the last week. Concrete chunks are falling onto the lower road.", auditor: "Sarah K." },
    { id: "RPT-843", project: "Kisumu Water & Sanitation", location: "Nyalenda Estate", issue: "No water supply for 4 days.", citizen: "Jane O.", status: "Resolved", urgency: "Medium", date: "Jun 28, 2026", description: "The new pipes were installed but our sector has not received a single drop of water since Thursday. The contractor left open trenches everywhere.", auditor: "David M." },
    { id: "RPT-844", project: "Mombasa Port Expansion Phase 2", location: "Dock B", issue: "Suspected material theft", citizen: "Anonymous", status: "Pending", urgency: "High", date: "Jul 4, 2026", description: "Trucks without official KPA branding are loading cement bags late at night (around 2 AM) from the main storage site.", auditor: null },
    { id: "RPT-845", project: "Eldoret Bypass Road", location: "Kapsabet Junction", issue: "Poor drainage causing flooding", citizen: "David K.", status: "Pending", urgency: "Medium", date: "Jul 3, 2026", description: "The road elevation is pushing all rainwater directly into the adjacent shops. Three businesses have flooded so far.", auditor: null },
  ]);

  // 🌟 UPGRADED: Assign Auditor now saves the name!
  const handleAssignAuditor = () => {
    const auditorName = window.prompt("Enter the name of the Auditor to assign:");
    if (auditorName) {
      const updatedReports = reports.map(r => 
        r.id === selectedReport.id ? { ...r, status: "Investigating", auditor: auditorName } : r
      );
      setReports(updatedReports);
      setSelectedReport({ ...selectedReport, status: "Investigating", auditor: auditorName });
    }
  };

  const handleMarkResolved = () => {
    const updatedReports = reports.map(r => 
      r.id === selectedReport.id ? { ...r, status: "Resolved" } : r
    );
    setReports(updatedReports);
    setSelectedReport({ ...selectedReport, status: "Resolved" });
  };

  // 🌟 NEW: Real CSV Export Function
  const handleExportCSV = () => {
    // 1. Create the column headers
    const headers = ["Report ID", "Project", "Location", "Issue", "Urgency", "Status", "Assigned Auditor", "Date Submitted"];
    
    // 2. Map the data into rows
    const csvRows = reports.map(r => 
      [r.id, r.project, r.location, r.issue, r.urgency, r.status, r.auditor || "Unassigned", r.date]
        .map(field => `"${field}"`) // Wrap fields in quotes to prevent comma issues
        .join(",")
    );

    // 3. Combine headers and rows
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...csvRows].join("\n");
    
    // 4. Trigger the download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Maendeleo_Reports_Log.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredReports = reports.filter((r) => {
    const matchesSearch = r.project.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.issue.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        
        {/* 🌟 WIRED: Export CSV Button */}
        <button 
          onClick={handleExportCSV}
          className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition shadow-sm flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export Report Log
        </button>
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
                <th className="px-6 py-4 font-semibold text-right">Date Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">No reports found matching your search criteria.</td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} onClick={() => setSelectedReport(report)} className="hover:bg-slate-50 transition cursor-pointer">
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{report.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{report.project}</td>
                    <td className="px-6 py-4 text-slate-600 truncate max-w-[200px]">{report.issue}</td>
                    <td className="px-6 py-4">{getUrgencyBadge(report.urgency)}</td>
                    <td className="px-6 py-4">{getStatusBadge(report.status)}</td>
                    <td className="px-6 py-4 text-slate-500 text-right">{report.date}</td>
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
                  <p className="text-xs font-mono text-slate-500">{selectedReport.id}</p>
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
                <div className="flex items-start gap-3"><ExternalLink className="w-5 h-5 text-slate-400 mt-0.5" /><div><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Related Project</p><p className="text-sm font-medium text-emerald-600 hover:underline cursor-pointer">{selectedReport.project}</p></div></div>
                <div className="flex items-start gap-3"><MapPin className="w-5 h-5 text-slate-400 mt-0.5" /><div><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Specific Location</p><p className="text-sm text-slate-900">{selectedReport.location}</p></div></div>
                <div className="flex items-start gap-3"><Calendar className="w-5 h-5 text-slate-400 mt-0.5" /><div><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Submitted On</p><p className="text-sm text-slate-900">{selectedReport.date} by <span className="font-medium">{selectedReport.citizen}</span></p></div></div>
                
                {/* 🌟 NEW: Shows the Assigned Auditor if one exists */}
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
                  
                  {/* 🌟 UPGRADED: Button text changes based on if an auditor is already assigned */}
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