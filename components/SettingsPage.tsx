import React from 'react';
import { Bell, Globe, Users, Database, Save } from 'lucide-react';

const SettingsPage: React.FC = () => {
  return (
    <div className="p-8 overflow-y-auto h-full max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Settings</h2>
      
      <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm divide-y divide-[#F0F7FB]">
        
        {/* General Settings */}
        <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#1BB0A3]" /> General
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
                    <input type="text" defaultValue="Acme Corp" className="w-full px-3 py-2 bg-[#F0F7FB] border border-[#BDDEF3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1BB0A3]" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Language</label>
                    <select className="w-full px-3 py-2 bg-[#F0F7FB] border border-[#BDDEF3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1BB0A3]">
                        <option>English (US)</option>
                        <option>Spanish</option>
                        <option>French</option>
                    </select>
                </div>
            </div>
        </div>

        {/* Notifications */}
        <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#E9C7DB]" /> Notifications
            </h3>
            <div className="space-y-3">
                <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-[#1BB0A3] rounded border-slate-300 focus:ring-[#1BB0A3]" />
                    <span className="text-sm text-slate-600">Email me when a candidate is shortlisted</span>
                </label>
                <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-[#1BB0A3] rounded border-slate-300 focus:ring-[#1BB0A3]" />
                    <span className="text-sm text-slate-600">Daily summary of new applicants</span>
                </label>
                 <label className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4 text-[#1BB0A3] rounded border-slate-300 focus:ring-[#1BB0A3]" />
                    <span className="text-sm text-slate-600">Push notifications for interview reminders</span>
                </label>
            </div>
        </div>

        {/* Integrations */}
        <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-slate-500" /> Integrations
            </h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-[#BDDEF3] rounded-lg">
                    <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-[#0077b5] rounded text-white flex items-center justify-center font-bold text-xs">in</div>
                         <div>
                             <p className="text-sm font-medium text-slate-800">LinkedIn Recruiter</p>
                             <p className="text-xs text-slate-500">Connected as admin@acme.com</p>
                         </div>
                    </div>
                    <button className="text-xs text-red-500 font-medium hover:underline">Disconnect</button>
                </div>
                 <div className="flex items-center justify-between p-3 border border-[#BDDEF3] rounded-lg">
                    <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-black rounded text-white flex items-center justify-center font-bold text-xs">GH</div>
                         <div>
                             <p className="text-sm font-medium text-slate-800">GitHub API</p>
                             <p className="text-xs text-slate-500">Not connected</p>
                         </div>
                    </div>
                    <button className="text-xs text-[#1BB0A3] font-medium hover:underline">Connect</button>
                </div>
            </div>
        </div>
        
         {/* Team */}
        <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#1BB0A3]" /> Team Access
            </h3>
             <div className="space-y-3">
                <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1BB0A3] text-white flex items-center justify-center text-xs font-bold">JD</div>
                        <div>
                             <p className="text-sm font-medium text-slate-800">John Doe (You)</p>
                             <p className="text-xs text-slate-500">Admin</p>
                         </div>
                     </div>
                </div>
                 <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#E9C7DB] text-slate-700 flex items-center justify-center text-xs font-bold">JS</div>
                        <div>
                             <p className="text-sm font-medium text-slate-800">Jane Smith</p>
                             <p className="text-xs text-slate-500">Recruiter</p>
                         </div>
                     </div>
                     <button className="text-xs text-slate-400 hover:text-slate-600">Remove</button>
                </div>
             </div>
             <button className="mt-4 text-sm text-[#1BB0A3] font-medium hover:underline flex items-center gap-1">
                 + Invite new member
             </button>
        </div>

        <div className="p-6 bg-[#F0F7FB] flex justify-end rounded-b-xl">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1BB0A3] text-white rounded-lg font-medium hover:bg-[#15968b] transition-colors">
                <Save className="w-4 h-4" /> Save Changes
            </button>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;