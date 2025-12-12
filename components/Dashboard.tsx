import React from "react";
import {
  Users,
  Clock,
  Award,
  UploadCloud,
  Eye,
  Briefcase,
  Star,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { DashboardStats } from "../types";

interface RecentCandidate {
  id: string;
  name: string;
  role: string;
  score: number;
  status: "New" | "Screening" | "Shortlisted" | "Interview";
  appliedDate: string;
  location: string;
}

const recentCandidates: RecentCandidate[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Senior Backend Engineer",
    score: 94,
    status: "Shortlisted",
    appliedDate: "2 hours ago",
    location: "San Francisco",
  },
  {
    id: "2",
    name: "Michael Park",
    role: "Product Designer",
    score: 87,
    status: "Interview",
    appliedDate: "5 hours ago",
    location: "Remote",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "DevOps Engineer",
    score: 82,
    status: "Screening",
    appliedDate: "Yesterday",
    location: "New York",
  },
  {
    id: "4",
    name: "James Wilson",
    role: "Frontend Developer",
    score: 78,
    status: "New",
    appliedDate: "Yesterday",
    location: "Austin",
  },
  {
    id: "5",
    name: "Lisa Thompson",
    role: "Data Scientist",
    score: 91,
    status: "Shortlisted",
    appliedDate: "2 days ago",
    location: "Seattle",
  },
];

interface DashboardProps {
  stats: DashboardStats;
  onNavigate: (view: string) => void;
  onUpload: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  stats,
  onNavigate,
  onUpload,
}) => {
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
            icon={<Users className="w-6 h-6 text-[#3f5ecc]" />}
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
            icon={<Award className="w-6 h-6 text-[#3f5ecc]" />}
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
          <PipelineStage
            label="New"
            count={15}
            color="bg-slate-100"
            borderColor="border-slate-200"
          />
          <PipelineStage
            label="Screening"
            count={8}
            color="bg-[#eef2ff]"
            borderColor="border-[#BDDEF3]"
            active
          />
          <PipelineStage
            label="Shortlisted"
            count={4}
            color="bg-[#E9C7DB]/20"
            borderColor="border-[#E9C7DB]"
          />
          <PipelineStage
            label="Interview"
            count={2}
            color="bg-[#3f5ecc]/10"
            borderColor="border-[#3f5ecc]"
          />
        </div>
      </div>

      {/* Recent Candidates */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">
            Recent Candidates
          </h2>
          <button
            onClick={() => onNavigate("candidates")}
            className="flex items-center gap-1 text-sm font-medium text-[#3f5ecc] hover:text-[#3552b8] transition-colors"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#f5f7ff] border-b border-[#BDDEF3]">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Applied
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#BDDEF3]">
              {recentCandidates.map((candidate) => (
                <tr
                  key={candidate.id}
                  className="hover:bg-[#F5F9FC] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#3f5ecc] text-white flex items-center justify-center text-sm font-bold">
                        {candidate.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 text-sm">
                          {candidate.name}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {candidate.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {candidate.role}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-bold ${
                        candidate.score >= 90
                          ? "text-emerald-600 bg-emerald-50"
                          : candidate.score >= 80
                          ? "text-blue-600 bg-blue-50"
                          : "text-amber-600 bg-amber-50"
                      }`}
                    >
                      <Star className="w-3 h-3" /> {candidate.score}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        candidate.status === "Shortlisted"
                          ? "bg-emerald-100 text-emerald-700"
                          : candidate.status === "Interview"
                          ? "bg-blue-100 text-blue-700"
                          : candidate.status === "Screening"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {candidate.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {candidate.appliedDate}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-[#3f5ecc] hover:bg-[#eef2ff] rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            <div className="w-10 h-10 rounded-full bg-[#eef2ff] flex items-center justify-center mb-4 group-hover:bg-[#3f5ecc] transition-colors">
              <UploadCloud className="w-5 h-5 text-[#3f5ecc] group-hover:text-white" />
            </div>
            <h3 className="font-semibold text-slate-800">Upload Resumes</h3>
            <p className="text-sm text-slate-500 mt-1">
              Bulk parse PDF/Word docs
            </p>
          </button>

          <button
            onClick={() => onNavigate("candidates")}
            className="bg-white p-6 rounded-xl border border-[#BDDEF3] hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-full bg-[#eef2ff] flex items-center justify-center mb-4 group-hover:bg-[#3f5ecc] transition-colors">
              <Eye className="w-5 h-5 text-[#3f5ecc] group-hover:text-white" />
            </div>
            <h3 className="font-semibold text-slate-800">View Candidates</h3>
            <p className="text-sm text-slate-500 mt-1">
              Check top recommendations
            </p>
          </button>

          <button
            onClick={() => onNavigate("job-postings")}
            className="bg-white p-6 rounded-xl border border-[#BDDEF3] hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-full bg-[#E9C7DB]/30 flex items-center justify-center mb-4 group-hover:bg-[#E9C7DB] transition-colors">
              <Briefcase className="w-5 h-5 text-slate-700 group-hover:text-slate-800" />
            </div>
            <h3 className="font-semibold text-slate-800">Job Postings</h3>
            <p className="text-sm text-slate-500 mt-1">Manage open positions</p>
          </button>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, subtext, icon, color }: any) => (
  <div
    className={`bg-white p-6 rounded-xl border border-[#BDDEF3] shadow-sm hover:border-[#3f5ecc] transition-colors relative overflow-hidden`}
  >
    <div className="flex justify-between items-start z-10 relative">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <h3 className="text-3xl font-bold text-slate-800 mt-2">{value}</h3>
        <p
          className={`text-xs mt-2 font-medium ${
            color === "pink" ? "text-slate-500" : "text-[#3f5ecc]"
          }`}
        >
          {subtext}
        </p>
      </div>
      <div
        className={`p-3 rounded-xl ${
          color === "pink" ? "bg-[#E9C7DB]/30" : "bg-[#eef2ff]"
        }`}
      >
        {icon}
      </div>
    </div>
  </div>
);

const PipelineStage = ({ label, count, color, borderColor, active }: any) => (
  <div
    className={`bg-white border ${borderColor} rounded-xl p-4 flex flex-col items-center justify-center h-32 relative shadow-sm`}
  >
    {active && (
      <div className="absolute top-2 right-2 w-2 h-2 bg-[#3f5ecc] rounded-full animate-pulse"></div>
    )}
    <h4 className="text-slate-500 font-medium text-sm uppercase tracking-wide">
      {label}
    </h4>
    <span className="text-3xl font-bold text-slate-800 mt-2">{count}</span>
    <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
      <div
        className={`h-full ${
          label === "New"
            ? "bg-slate-400"
            : label === "Screening"
            ? "bg-[#3f5ecc]"
            : "bg-[#E9C7DB]"
        } rounded-full`}
        style={{ width: "60%" }}
      ></div>
    </div>
  </div>
);

export default Dashboard;
