import React, { useState, useEffect } from "react";
import { Activity, Search, Download } from "lucide-react";
import api from '../api'; 
import { generatePDF } from '../utils/generatePDF';

export default function SystemLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [logs, setLogs] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/logs'); 
        const data = response.data.data || response.data || [];
        setLogs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch system logs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

    const filteredLogs = logs.filter((log) => {
    const search = searchTerm.toLowerCase();
    const safeUser = log.user || log.user_email || ""; // Supports both key names
    const safeAction = log.action || "";
    const safeTarget = log.target || "";
    
    return safeUser.toLowerCase().includes(search) || 
           safeAction.toLowerCase().includes(search) || 
           safeTarget.toLowerCase().includes(search);
  });

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      alert("No data to export!");
      return;
    }

    const headers = ["Log ID", "Timestamp", "User", "Action", "Target Object"];
    const csvRows = filteredLogs.map(log => 
      `${log.id || log.log_id},"${log.date || log.created_at}","${log.user || log.user_email}","${log.action}","${log.target}"`
    );
    
    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "maendeleo_system_logs.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    if (filteredLogs.length === 0) {
      alert("No data to export!");
      return;
    }

    generatePDF(
      "Maendeleo System Audit Logs",
      [
        { header: "Log ID", key: "id", format: (log) => String(log.id || log.log_id || "") },
        { header: "Timestamp", key: "date", format: (log) => log.date || log.created_at || "N/A" },
        { header: "User", key: "user", format: (log) => log.user || log.user_email || "" },
        { header: "Action", key: "action" },
        { header: "Target", key: "target" },
      ],
      filteredLogs,
      "maendeleo_system_logs"
    );
  };

  return (
    <div className="space-y-6 h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-600" />
            System Audit Logs
          </h1>
          <p className="text-sm text-slate-500 mt-1">Immutable record of all database and user actions.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm"
          >
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search logs by user, action, or target..." 
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-10 text-center text-slate-500 font-medium">Loading security logs...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-10 text-center text-slate-500 font-medium">No system logs found matching your search.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="px-6 py-4 font-semibold">Log ID</th>
                  <th className="px-6 py-4 font-semibold">Timestamp</th>
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Action</th>
                  <th className="px-6 py-4 font-semibold">Target Object</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredLogs.map((log, index) => (
                  <tr key={log.id || index} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                      {(log.id || String(index)).toString().substring(0,8)}...
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {log.date || log.created_at ? new Date(log.date || log.created_at).toLocaleString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">{log.user || log.user_email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold tracking-wider ${
                        log.action === 'DELETE' ? 'bg-red-100 text-red-700' : 
                        log.action === 'UPDATE' || log.action === 'PUT' ? 'bg-blue-100 text-blue-700' : 
                        log.action === 'CREATE' || log.action === 'POST' ? 'bg-emerald-100 text-emerald-700' : 
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{log.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}