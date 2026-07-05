import React from "react";
// 🌟 NEW: We import useNavigate to switch pages!
import { useNavigate } from "react-router-dom";
import { FolderKanban, AlertTriangle, Users, TrendingUp, CheckCircle2, Clock, ArrowUpRight, ArrowDownRight, Activity, FileText } from "lucide-react";

export default function DashboardPage() {
  // 🌟 NEW: Initialize the navigate function
  const navigate = useNavigate();

  const recentActivities = [
    { id: 1, user: "Sarah K.", action: "assigned auditor to", target: "RPT-842", time: "2 hours ago", type: "report" },
    { id: 2, user: "System Admin", action: "exported", target: "Reports Log CSV", time: "5 hours ago", type: "system" },
    { id: 3, user: "David M.", action: "marked as resolved", target: "Kisumu Water (RPT-843)", time: "Yesterday", type: "success" },
    { id: 4, user: "System Admin", action: "registered new project", target: "Eldoret Bypass", time: "2 days ago", type: "project" },
  ];

  return (
    <div className="space-y-6 h-full pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Command Center</h1>
          <p className="text-sm text-slate-500 mt-1">Here is what is happening across all infrastructure projects today.</p>
        </div>
        <div className="text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-600" />
          Last updated: Just now
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">Active Projects</p>
              <h3 className="text-3xl font-bold text-slate-900">124</h3>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><FolderKanban className="w-5 h-5"/></div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="flex items-center text-emerald-600 font-medium"><ArrowUpRight className="w-4 h-4 mr-1"/> 12%</span>
            <span className="text-slate-400">vs last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">Budget Tracked</p>
              <h3 className="text-3xl font-bold text-slate-900">142<span className="text-xl text-slate-500 font-medium">.5B</span></h3>
            </div>
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600"><TrendingUp className="w-5 h-5"/></div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="flex items-center text-emerald-600 font-medium"><ArrowUpRight className="w-4 h-4 mr-1"/> 4.2%</span>
            <span className="text-slate-400">vs last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">Critical Reports</p>
              <h3 className="text-3xl font-bold text-slate-900">18</h3>
            </div>
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600"><AlertTriangle className="w-5 h-5"/></div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="flex items-center text-red-600 font-medium"><ArrowUpRight className="w-4 h-4 mr-1"/> 3 new</span>
            <span className="text-slate-400">since yesterday</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">Field Agents</p>
              <h3 className="text-3xl font-bold text-slate-900">45</h3>
            </div>
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600"><Users className="w-5 h-5"/></div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="flex items-center text-emerald-600 font-medium"><ArrowDownRight className="w-4 h-4 mr-1"/> 100%</span>
            <span className="text-slate-400">online today</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN - Project Health */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">National Project Health</h2>
            {/* 🌟 WIRED: Clicking this magically teleports you to the Projects page */}
            <button 
              onClick={() => navigate("/projects")}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition"
            >
              View All Projects &rarr;
            </button>
          </div>
          
          <div className="space-y-8">
            <div>
              <div className="flex justify-between text-sm mb-2"><span className="font-semibold text-slate-700 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> On Track</span><span className="font-bold">65%</span></div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden"><div className="bg-emerald-500 h-3 rounded-full" style={{ width: '65%' }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2"><span className="font-semibold text-slate-700 flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500"/> Minor Delays</span><span className="font-bold">25%</span></div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden"><div className="bg-amber-500 h-3 rounded-full" style={{ width: '25%' }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2"><span className="font-semibold text-slate-700 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-500"/> Critical Risk</span><span className="font-bold">10%</span></div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden"><div className="bg-red-500 h-3 rounded-full" style={{ width: '10%' }}></div></div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Activity Feed */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              Live Audit Log
            </h2>
          </div>
          
          <div className="space-y-6">
            {recentActivities.map((activity, index) => (
              <div key={activity.id} className="relative flex gap-4">
                {index !== recentActivities.length - 1 && (
                  <div className="absolute left-4 top-8 bottom-[-24px] w-0.5 bg-slate-100"></div>
                )}
                
                <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-4 border-white
                  ${activity.type === 'report' ? 'bg-amber-100 text-amber-600' : 
                    activity.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 
                    activity.type === 'project' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    activity.type === 'report' ? 'bg-amber-500' : 
                    activity.type === 'success' ? 'bg-emerald-500' : 
                    activity.type === 'project' ? 'bg-blue-500' : 'bg-slate-500'
                  }`}></div>
                </div>

                <div>
                  <p className="text-sm text-slate-800">
                    <span className="font-bold">{activity.user}</span> {activity.action} <span className="font-semibold text-slate-900">{activity.target}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* 🌟 WIRED: Placeholder alert for the future Audit module */}
          <button 
            onClick={() => alert("The full Audit Log module is scheduled for Phase 2! Your Spring Boot developer will connect this to the database's Activity table.")}
            className="w-full mt-6 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-medium rounded-xl transition"
          >
            View Full System Log
          </button>
        </div>

      </div>
    </div>
  );
}