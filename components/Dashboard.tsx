import React from 'react';
import { Users, Clock, Award, TrendingUp, UploadCloud, Eye, BarChart2 } from 'lucide-react';
import { DashboardStats } from '../types';

interface DashboardProps {
  stats: DashboardStats;
  onNavigate: (view: string) => void;
  onUpload: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, onNavigate, onUpload }) => {
  return (
    <div className="p-8 overflow-y-auto h-full space-y-8">
      
      {/* Key Metrics */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            Key Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard 
                label="Resumes Processed" 
                value={stats.totalApplicants.toString()} 
                subtext="+12% from last week"
                icon={<Users className="w-6 h-6 text-[#1BB0A3]" />}
                color="teal"
            />
            <MetricCard 
                label="Time Saved" 
                value="42 hours" 
                subtext="Automated screening & scheduling"
                icon={<Clock className="w-6 h-6 text-[#E9C7DB]" />}
                color="pink"
            />
            <MetricCard 
                label="Avg. AI Score" 
                value="72/100" 
                subtext="Quality of current pool"
                icon={<Award className="w-6 h-6 text-[#1BB0A3]" />}
                color="teal"
            />
        </div>
      </div>

      {/* Pipeline View (Kanban) */}
      <div>
         <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            Pipeline View
        </h2>
        <div className="grid grid-cols-4 gap-4">
            <PipelineStage label="New" count={15} color="bg-slate-100" borderColor="border-slate-200" />
            <PipelineStage label="Screening" count={8} color="bg-[#D7E9F4]" borderColor="border-[#BDDEF3]" active />
            <PipelineStage label="Shortlisted" count={4} color="bg-[#E9C7DB]/20" borderColor="border-[#E9C7DB]" />
            <PipelineStage label="Interview" count={2} color="bg-[#1BB0A3]/10" borderColor="border-[#1BB0A3]" />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button 
                onClick={onUpload} 
                className="bg-white p-6 rounded-xl border border-[#BDDEF3] hover:shadow-md transition-all text-left group"
            >
                <div className="w-10 h-10 rounded-full bg-[#D7E9F4] flex items-center justify-center mb-4 group-hover:bg-[#1BB0A3] transition-colors">
                    <UploadCloud className="w-5 h-5 text-[#1BB0A3] group-hover:text-white" />
                </div>
                <h3 className="font-semibold text-slate-800">Upload Resumes</h3>
                <p className="text-sm text-slate-500 mt-1">Bulk parse PDF/Word docs</p>
            </button>

            <button 
                onClick={() => onNavigate('candidates')} 
                className="bg-white p-6 rounded-xl border border-[#BDDEF3] hover:shadow-md transition-all text-left group"
            >
                <div className="w-10 h-10 rounded-full bg-[#D7E9F4] flex items-center justify-center mb-4 group-hover:bg-[#1BB0A3] transition-colors">
                    <Eye className="w-5 h-5 text-[#1BB0A3] group-hover:text-white" />
                </div>
                <h3 className="font-semibold text-slate-800">View Candidates</h3>
                <p className="text-sm text-slate-500 mt-1">Check top recommendations</p>
            </button>

            <button 
                onClick={() => onNavigate('market_intel')} 
                className="bg-white p-6 rounded-xl border border-[#BDDEF3] hover:shadow-md transition-all text-left group"
            >
                <div className="w-10 h-10 rounded-full bg-[#E9C7DB]/30 flex items-center justify-center mb-4 group-hover:bg-[#E9C7DB] transition-colors">
                    <BarChart2 className="w-5 h-5 text-slate-700 group-hover:text-slate-800" />
                </div>
                <h3 className="font-semibold text-slate-800">Market Data</h3>
                <p className="text-sm text-slate-500 mt-1">Salary & Competitor Intel</p>
            </button>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, subtext, icon, color }: any) => (
    <div className={`bg-white p-6 rounded-xl border border-[#BDDEF3] shadow-sm hover:border-[#1BB0A3] transition-colors relative overflow-hidden`}>
        <div className="flex justify-between items-start z-10 relative">
            <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-2">{value}</h3>
                <p className={`text-xs mt-2 font-medium ${color === 'pink' ? 'text-slate-500' : 'text-[#1BB0A3]'}`}>{subtext}</p>
            </div>
            <div className={`p-3 rounded-xl ${color === 'pink' ? 'bg-[#E9C7DB]/30' : 'bg-[#D7E9F4]'}`}>
                {icon}
            </div>
        </div>
    </div>
);

const PipelineStage = ({ label, count, color, borderColor, active }: any) => (
    <div className={`bg-white border ${borderColor} rounded-xl p-4 flex flex-col items-center justify-center h-32 relative shadow-sm`}>
        {active && <div className="absolute top-2 right-2 w-2 h-2 bg-[#1BB0A3] rounded-full animate-pulse"></div>}
        <h4 className="text-slate-500 font-medium text-sm uppercase tracking-wide">{label}</h4>
        <span className="text-3xl font-bold text-slate-800 mt-2">{count}</span>
        <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div className={`h-full ${label === 'New' ? 'bg-slate-400' : label === 'Screening' ? 'bg-[#1BB0A3]' : 'bg-[#E9C7DB]'} rounded-full`} style={{ width: '60%' }}></div>
        </div>
    </div>
);

export default Dashboard;