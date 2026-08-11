import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FolderKanban, AlertTriangle, Users, TrendingUp, CheckCircle2, Clock, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import api from '../api';

export default function DashboardPage() {
  const navigate = useNavigate();

  // Dynamic State for all dashboard sections
  const [projects, setProjects] = useState([]);
  const [reports, setReports] = useState([]);
  const [agents, setAgents] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // allSettled will not reject the whole block if one request 404s
        const results = await Promise.allSettled([
          api.get('/projects'),
          api.get('/audits'),
          api.get('/users'),
          api.get('/logs?limit=5')
        ]);

        const [projectsRes, reportsRes, usersRes, logsRes] = results;

        // Helper function to safely extract data from fulfilled promises
        const extractData = (res) => {
          if (res.status === 'fulfilled') {
            return res.value.data?.data || res.value.data || [];
          }
          return [];
        };

        setProjects(extractData(projectsRes));
        setReports(extractData(reportsRes));
        
        const allUsers = extractData(usersRes);
        setAgents(allUsers.filter(u => u.role === 'Field Agent'));
        
        setRecentActivities(extractData(logsRes));

        // Log which specific endpoints failed to the console to help you debug
        results.forEach((res, index) => {
          if (res.status === 'rejected') {
            const endpoints = ['/projects', '/audits', '/users', '/logs'];
            console.warn(`API Error on ${endpoints[index]}:`, res.reason.message);
          }
        });

      } catch (error) {
        console.error("Critical failure loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // --- Projects Calculations ---
  const totalProjects = projects.length;
  const activeCount = projects.filter(p => p.status?.toLowerCase() === 'active').length;
  const delayedCount = projects.filter(p => p.status?.toLowerCase() === 'delayed').length;
  const completedCount = projects.filter(p => p.status?.toLowerCase() === 'completed').length; 

  const totalBudget = projects.reduce((sum, project) => {
    const amount = Number(project.budget_allocated || 0);
    return sum + amount;
  }, 0);

  const formatCurrency = (amount) => {
    if (amount >= 1e9) return `${(amount / 1e9).toFixed(1)}B`;
    if (amount >= 1e6) return `${(amount / 1e6).toFixed(1)}M`;
    return amount.toLocaleString();
  };

  const activePercent = totalProjects ? Math.round((activeCount / totalProjects) * 100) : 0;
  const delayedPercent = totalProjects ? Math.round((delayedCount / totalProjects) * 100) : 0;
  const completedPercent = totalProjects ? Math.round((completedCount / totalProjects) * 100) : 0;

  // --- Reports & Agents Calculations ---
  const criticalReportsCount = reports.filter(r => r.status?.toLowerCase() === 'critical' || r.severity?.toLowerCase() === 'critical').length;
  
  // Calculate reports added in the last 24 hours
  const recentReportsCount = reports.filter(r => {
    const reportDate = new Date(r.created_at);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return reportDate > yesterday;
  }).length;

  const agentsCount = agents.length;
  const activeAgentsCount = agents.filter(a => a.status?.toLowerCase() === 'active').length;
  const onlineAgentsPercent = agentsCount ? Math.round((activeAgentsCount / agentsCount) * 100) : 0;

  if (isLoading) {
    return <div className="flex h-full items-center justify-center text-slate-500 font-medium">Loading Command Center data...</div>;
  }

  return (
    <div className="space-y-6 h-full pb-10">
      
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Active Projects Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">Active Projects</p>
              <h3 className="text-3xl font-bold text-slate-900">{activeCount}</h3>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><FolderKanban className="w-5 h-5"/></div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="flex items-center text-emerald-600 font-medium"><ArrowUpRight className="w-4 h-4 mr-1"/> Live Data</span>
            <span className="text-slate-400">from database</span>
          </div>
        </div>

        {/* Budget Tracked Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">Budget Tracked</p>
              <h3 className="text-3xl font-bold text-slate-900">
                {formatCurrency(totalBudget).replace(/[a-zA-Z]+/, '')}
                <span className="text-xl text-slate-500 font-medium">
                  {formatCurrency(totalBudget).replace(/[^a-zA-Z]+/, '')}
                </span>
              </h3>
            </div>
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600"><TrendingUp className="w-5 h-5"/></div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="flex items-center text-emerald-600 font-medium"><ArrowUpRight className="w-4 h-4 mr-1"/> Live Data</span>
            <span className="text-slate-400">from database</span>
          </div>
        </div>

        {/* Critical Reports Card (Now Dynamic) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">Critical Reports</p>
              <h3 className="text-3xl font-bold text-slate-900">{criticalReportsCount}</h3>
            </div>
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600"><AlertTriangle className="w-5 h-5"/></div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="flex items-center text-red-600 font-medium"><ArrowUpRight className="w-4 h-4 mr-1"/> {recentReportsCount} new</span>
            <span className="text-slate-400">since yesterday</span>
          </div>
        </div>

        {/* Field Agents Card (Now Dynamic) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">Field Agents</p>
              <h3 className="text-3xl font-bold text-slate-900">{agentsCount}</h3>
            </div>
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600"><Users className="w-5 h-5"/></div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="flex items-center text-emerald-600 font-medium"><ArrowDownRight className="w-4 h-4 mr-1"/> {onlineAgentsPercent}%</span>
            <span className="text-slate-400">active status</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* National Project Health */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">National Project Health</h2>
            <button 
              onClick={() => navigate("/projects")}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition"
            >
              View All Projects &rarr;
            </button>
          </div>
          
          <div className="space-y-8">
            <div>
              <div className="flex justify-between text-sm mb-2"><span className="font-semibold text-slate-700 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Active / On Track</span><span className="font-bold">{activePercent}%</span></div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="bg-emerald-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${activePercent}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2"><span className="font-semibold text-slate-700 flex items-center gap-2"><Clock className="w-4 h-4 text-blue-500"/> Completed</span><span className="font-bold">{completedPercent}%</span></div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="bg-blue-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${completedPercent}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2"><span className="font-semibold text-slate-700 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500"/> Delayed Status</span><span className="font-bold">{delayedPercent}%</span></div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="bg-amber-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${delayedPercent}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Audit Log (Now Dynamic) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              Live Audit Log
            </h2>
          </div>
          
          <div className="space-y-6">
            {recentActivities.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                No recent system activity found in database.
              </div>
            ) : (
              recentActivities.map((activity, index) => {
                const activityType = activity.status?.toLowerCase() || activity.type;

                return (
                  <div key={activity.id} className="relative flex gap-4">
                    {index !== recentActivities.length - 1 && (
                      <div className="absolute left-4 top-8 bottom-[-24px] w-0.5 bg-slate-100"></div>
                    )}
                    
                    <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-4 border-white
                      ${activityType === 'report' ? 'bg-amber-100 text-amber-600' : 
                        activityType === 'success' ? 'bg-emerald-100 text-emerald-600' : 
                        activityType === 'project' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        activityType === 'report' ? 'bg-amber-500' : 
                        activityType === 'success' ? 'bg-emerald-500' : 
                        activityType === 'project' ? 'bg-blue-500' : 'bg-slate-500'
                      }`}></div>
                    </div>

                    <div>
                      <p className="text-sm text-slate-800">
                        <span className="font-bold">{activity.user}</span> {activity.action} <span className="font-semibold text-slate-900">{activity.target}</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {activity.date || new Date(activity.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          <button 
            onClick={() => navigate('/logs')} 
            className="w-full mt-6 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-medium rounded-xl transition"
          >
            View Full System Log
          </button>
        </div>

      </div>
    </div>
  );
}