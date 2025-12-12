import React from 'react';
import { Mail, MapPin, Award, Clock, Briefcase } from 'lucide-react';

const ProfilePage: React.FC = () => {
  return (
    <div className="p-8 overflow-y-auto h-full max-w-4xl mx-auto">
      
      {/* Header Card */}
      <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
         <div className="w-24 h-24 rounded-full bg-[#1BB0A3] text-white flex items-center justify-center text-3xl font-bold shadow-inner">
             JD
         </div>
         <div className="flex-1 text-center md:text-left">
             <h2 className="text-2xl font-bold text-slate-800">John Doe</h2>
             <p className="text-slate-500 font-medium">Senior Technical Recruiter</p>
             <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-sm text-slate-600">
                 <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-[#1BB0A3]" /> San Francisco, CA</span>
                 <span className="flex items-center gap-1"><Mail className="w-4 h-4 text-[#1BB0A3]" /> john.doe@acme.com</span>
             </div>
         </div>
         <button className="px-4 py-2 border border-[#BDDEF3] rounded-lg text-sm font-medium text-slate-600 hover:bg-[#F0F7FB]">Edit Profile</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <div className="bg-white p-6 rounded-xl border border-[#BDDEF3] shadow-sm text-center">
               <div className="w-10 h-10 rounded-full bg-[#D7E9F4] flex items-center justify-center mx-auto mb-3">
                   <Award className="w-5 h-5 text-[#1BB0A3]" />
               </div>
               <h3 className="text-2xl font-bold text-slate-800">142</h3>
               <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mt-1">Candidates Hired</p>
           </div>
           <div className="bg-white p-6 rounded-xl border border-[#BDDEF3] shadow-sm text-center">
               <div className="w-10 h-10 rounded-full bg-[#E9C7DB]/30 flex items-center justify-center mx-auto mb-3">
                   <Clock className="w-5 h-5 text-slate-700" />
               </div>
               <h3 className="text-2xl font-bold text-slate-800">12 Days</h3>
               <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mt-1">Avg. Time to Hire</p>
           </div>
           <div className="bg-white p-6 rounded-xl border border-[#BDDEF3] shadow-sm text-center">
               <div className="w-10 h-10 rounded-full bg-[#F0F7FB] flex items-center justify-center mx-auto mb-3 border border-[#BDDEF3]">
                   <Briefcase className="w-5 h-5 text-[#1BB0A3]" />
               </div>
               <h3 className="text-2xl font-bold text-slate-800">8</h3>
               <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mt-1">Active Roles</p>
           </div>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Account Information</h3>
          
          <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase">Full Name</label>
                      <p className="text-sm font-medium text-slate-800 mt-1 p-2 bg-[#F0F7FB] rounded border border-[#BDDEF3]">John Doe</p>
                  </div>
                  <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase">Role</label>
                      <p className="text-sm font-medium text-slate-800 mt-1 p-2 bg-[#F0F7FB] rounded border border-[#BDDEF3]">Admin</p>
                  </div>
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase">Email Address</label>
                      <p className="text-sm font-medium text-slate-800 mt-1 p-2 bg-[#F0F7FB] rounded border border-[#BDDEF3]">john.doe@acme.com</p>
                  </div>
                  <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase">Phone</label>
                      <p className="text-sm font-medium text-slate-800 mt-1 p-2 bg-[#F0F7FB] rounded border border-[#BDDEF3]">+1 (555) 000-0000</p>
                  </div>
              </div>
          </div>
          
           <div className="mt-8 pt-6 border-t border-[#BDDEF3]">
                <h4 className="text-sm font-bold text-slate-800 mb-4">Security</h4>
                <button className="text-sm text-[#1BB0A3] font-medium hover:underline block mb-2">Change Password</button>
                <button className="text-sm text-[#1BB0A3] font-medium hover:underline block">Enable Two-Factor Authentication</button>
           </div>
      </div>

    </div>
  );
};

export default ProfilePage;