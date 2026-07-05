import React, { useState, useRef } from "react";
import { User, Lock, Bell, Database, Save, CheckCircle2, ShieldCheck, Mail, Smartphone, Server, Eye, EyeOff, Camera, Moon, Sun, Monitor } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // 🌟 NEW: Image Picker State & Ref
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);

  // 🌟 NEW: Password Reveal State
  const [showPassword, setShowPassword] = useState(false);

  // Toggle States
  const [twoFactor, setTwoFactor] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  
  // 🌟 NEW: Theme State
  const [theme, setTheme] = useState("light");

  const [formData, setFormData] = useState({
    name: "System Admin",
    email: "admin@maendeleo.go.ke",
    phone: "+254 700 000 000",
    apiUrl: "http://localhost:8080/api/v1" 
  });

  // 🌟 NEW: Handle actual file selection
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a temporary local URL to show the image instantly
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      // In the real app, this is where we send all data to Spring Boot!
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const ToggleSwitch = ({ enabled, setEnabled }) => (
    <button 
      type="button"
      onClick={() => setEnabled(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto h-full pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your account, security preferences, and system integrations.</p>
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
          <button onClick={() => setActiveTab("Profile")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab === "Profile" ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-50"}`}><User className="w-5 h-5" /> My Profile</button>
          <button onClick={() => setActiveTab("Security")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab === "Security" ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-50"}`}><Lock className="w-5 h-5" /> Security</button>
          <button onClick={() => setActiveTab("Notifications")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab === "Notifications" ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-50"}`}><Bell className="w-5 h-5" /> Notifications</button>
          <button onClick={() => setActiveTab("Appearance")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab === "Appearance" ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-50"}`}><Sun className="w-5 h-5" /> Appearance</button>
          <button onClick={() => setActiveTab("System")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab === "System" ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-50"}`}><Database className="w-5 h-5" /> System / API</button>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 max-w-2xl">
          <form onSubmit={handleSave}>
            
            {/* 🌟 UPGRADED: PROFILE TAB */}
            {activeTab === "Profile" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Personal Information</h2>
                
                <div className="flex items-center gap-6 mb-6">
                  {/* The actual Avatar Image */}
                  <div className="relative w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-3xl overflow-hidden shadow-sm border border-slate-200">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      "SA"
                    )}
                  </div>
                  
                  <div>
                    {/* Hidden File Input */}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageUpload} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    {/* The Button that triggers the hidden input */}
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
                    <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                    <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Official Email Address</label>
                    <input type="email" disabled className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed" value={formData.email} />
                  </div>
                </div>
              </div>
            )}

            {/* 🌟 UPGRADED: SECURITY TAB */}
            {activeTab === "Security" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Security Settings</h2>
                
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-emerald-600"/></div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Two-Factor Authentication (2FA)</h3>
                      <p className="text-sm text-slate-500">Require an extra security code when logging in.</p>
                    </div>
                  </div>
                  <ToggleSwitch enabled={twoFactor} setEnabled={setTwoFactor} />
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="font-semibold text-slate-900">Change Password</h3>
                  
                  {/* Eye Toggle wrapped inside the input relative div */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Current Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none pr-10" 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                      <div className="relative">
                        <input type={showPassword ? "text" : "password"} placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none pr-10" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
                      <div className="relative">
                        <input type={showPassword ? "text" : "password"} placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none pr-10" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === "Notifications" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Alert Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-slate-400" /><div><h3 className="font-medium text-slate-900">Email Alerts</h3><p className="text-sm text-slate-500">Get notified about critical project updates.</p></div></div>
                    <ToggleSwitch enabled={emailAlerts} setEnabled={setEmailAlerts} />
                  </div>
                  <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3"><Smartphone className="w-5 h-5 text-slate-400" /><div><h3 className="font-medium text-slate-900">SMS Notifications</h3><p className="text-sm text-slate-500">Immediate text alerts for "Critical" citizen reports.</p></div></div>
                    <ToggleSwitch enabled={smsAlerts} setEnabled={setSmsAlerts} />
                  </div>
                </div>
              </div>
            )}

            {/* 🌟 NEW: APPEARANCE TAB */}
            {activeTab === "Appearance" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Interface Theme</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button 
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition ${theme === "light" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"}`}
                  >
                    <Sun className="w-8 h-8 mb-3" />
                    <span className="font-semibold">Light Mode</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition ${theme === "dark" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"}`}
                  >
                    <Moon className="w-8 h-8 mb-3" />
                    <span className="font-semibold">Dark Mode</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => setTheme("system")}
                    className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition ${theme === "system" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"}`}
                  >
                    <Monitor className="w-8 h-8 mb-3" />
                    <span className="font-semibold">System Match</span>
                  </button>
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  * Note: Implementing full dark mode across all pages requires setting up Tailwind's dark mode classes in a later development phase.
                </p>
              </div>
            )}

            {/* SYSTEM TAB */}
            {activeTab === "System" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Backend Integration</h2>
                <div className="bg-slate-900 p-6 rounded-xl text-white">
                  <div className="flex items-center gap-3 mb-4"><Server className="w-6 h-6 text-emerald-500" /><h3 className="font-bold text-lg">Spring Boot Configuration</h3></div>
                  <p className="text-sm text-slate-400 mb-6">Connect this React frontend to your custom Java backend. All API requests will be routed to this base URL.</p>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Base API URL Endpoint</label>
                    <input type="text" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-emerald-400 font-mono rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.apiUrl} onChange={(e) => setFormData({...formData, apiUrl: e.target.value})} />
                  </div>
                </div>
              </div>
            )}

            {/* SAVE BUTTON */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
              <button type="submit" disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-medium transition flex items-center gap-2 disabled:opacity-70">
                {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}