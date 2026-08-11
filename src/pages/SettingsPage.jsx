import React, { useState, useRef } from "react";
import { User, Database, Save, CheckCircle2, Server, Camera, AlertCircle } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "Victor Masinde",
    email: "admin@test.com",
    phone: "+254 700 000 000",
    apiUrl: "http://localhost:3000/api" 
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call to save settings
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto h-full pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your account and system integrations.</p>
        </div>
        
        {showSuccess && (
          <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg flex items-center gap-2 font-medium border border-emerald-100 animate-in slide-in-from-top-2 fade-in">
            <CheckCircle2 className="w-5 h-5" /> Settings saved successfully!
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[500px]">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="w-full lg:w-64 flex flex-col gap-1 border-b lg:border-b-0 lg:border-r border-slate-100 pr-0 lg:pr-6 pb-6 lg:pb-0">
          <button onClick={() => setActiveTab("Profile")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab === "Profile" ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-50"}`}>
            <User className="w-5 h-5" /> My Profile
          </button>
          <button onClick={() => setActiveTab("System")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab === "System" ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-50"}`}>
            <Database className="w-5 h-5" /> System / API
          </button>
        </div>

        {/* SETTINGS CONTENT */}
        <div className="flex-1 max-w-2xl">
          <form onSubmit={handleSave}>
            
            {/* PROFILE TAB */}
            {activeTab === "Profile" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Personal Information</h2>
                
                <div className="flex items-center gap-6 mb-6">
                  <div className="relative w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-3xl overflow-hidden shadow-sm border border-slate-200">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      formData.name.substring(0, 2).toUpperCase()
                    )}
                  </div>
                  
                  <div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageUpload} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current.click()}
                      className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4" /> Change Photo
                    </button>
                    <p className="text-xs text-slate-500 mt-2">JPG, GIF or PNG. Max size of 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                    <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                    <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Official Email Address</label>
                    <input type="email" disabled className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed" value={formData.email} />
                    <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Email address is managed by Firebase Authentication.</p>
                  </div>
                </div>
              </div>
            )}

            {/* SYSTEM TAB */}
            {activeTab === "System" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Backend Integration</h2>
                <div className="bg-slate-900 p-6 rounded-xl text-white">
                  <div className="flex items-center gap-3 mb-4"><Server className="w-6 h-6 text-emerald-500" /><h3 className="font-bold text-lg">Express.js API Configuration</h3></div>
                  <p className="text-sm text-slate-400 mb-6">Connect this React frontend to your Express backend. All network requests and PostgreSQL database interactions will route through this base URL.</p>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Base API URL Endpoint</label>
                    <input type="text" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-emerald-400 font-mono rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition" value={formData.apiUrl} onChange={(e) => setFormData({...formData, apiUrl: e.target.value})} />
                  </div>
                </div>
              </div>
            )}

            {/* SAVE ACTION */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
              <button type="submit" disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-medium transition flex items-center gap-2 disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
                {isSaving ? "Saving Settings..." : "Save Changes"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}