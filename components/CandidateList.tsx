import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  LayoutGrid,
  List as ListIcon,
  MoreHorizontal,
  ChevronDown,
  CheckSquare,
  XSquare,
  Download,
  MapPin,
  Briefcase,
  ChevronRight,
  Brain,
  Eye,
} from "lucide-react";
import { Candidate } from "../types";

interface CandidateListProps {
  onSelectCandidate: (candidate: Candidate) => void;
  onReviewCandidate?: (candidate: Candidate) => void;
  candidates?: Candidate[];
}

// Mock Data Generator
const generateCandidates = (): Candidate[] => {
  return [
    {
      id: "1",
      name: "Sarah Chen",
      role: "Senior Backend Engineer",
      score: 94,
      status: "New",
      experienceYears: 8,
      matchReason: "Strong Skill Match",
      skills: ["Python", "Django", "PostgreSQL", "AWS"],
      missingSkills: ["Kubernetes"],
      previousCompanies: [
        {
          name: "Stripe",
          role: "Senior Engineer",
          duration: "4 years",
          context: "Series C to IPO",
        },
      ],
      webVerification: {
        github: {
          handle: "@sarahchen",
          contributions: 847,
          topLanguages: ["Python"],
          notableProject: "Django REST",
          verified: true,
        },
        salaryBenchmark: {
          min: 145000,
          max: 175000,
          currency: "USD",
          location: "San Francisco",
        },
        redFlags: [],
        linkedin: { verified: true, roleMatch: true },
      },
    },
    {
      id: "2",
      name: "Michael Ross",
      role: "Frontend Developer",
      score: 88,
      status: "Screening",
      experienceYears: 5,
      matchReason: "Good Portfolio",
      skills: ["React", "TypeScript", "Tailwind", "Redux"],
      missingSkills: ["Next.js"],
      previousCompanies: [
        {
          name: "Shopify",
          role: "Developer",
          duration: "2 years",
          context: "Growth",
        },
      ],
      webVerification: {
        salaryBenchmark: {
          min: 120000,
          max: 150000,
          currency: "USD",
          location: "Remote",
        },
        redFlags: [],
        linkedin: { verified: true, roleMatch: true },
      },
    },
    {
      id: "3",
      name: "Jessica Pearson",
      role: "Product Manager",
      score: 92,
      status: "Interview",
      experienceYears: 10,
      matchReason: "Industry Expert",
      skills: ["Agile", "Roadmapping", "Data Analysis", "JIRA"],
      missingSkills: [],
      previousCompanies: [
        {
          name: "Google",
          role: "PM",
          duration: "5 years",
          context: "Enterprise",
        },
      ],
      webVerification: {
        salaryBenchmark: {
          min: 180000,
          max: 220000,
          currency: "USD",
          location: "New York",
        },
        redFlags: [],
        linkedin: { verified: true, roleMatch: true },
      },
    },
    {
      id: "4",
      name: "David Kim",
      role: "DevOps Engineer",
      score: 75,
      status: "Rejected",
      experienceYears: 3,
      matchReason: "Lack of Experience",
      skills: ["AWS", "Docker", "Linux"],
      missingSkills: ["Terraform", "CI/CD"],
      previousCompanies: [
        {
          name: "Startup Inc",
          role: "Junior DevOps",
          duration: "1 year",
          context: "Seed",
        },
      ],
      webVerification: {
        salaryBenchmark: {
          min: 100000,
          max: 130000,
          currency: "USD",
          location: "Austin",
        },
        redFlags: [],
        linkedin: { verified: true, roleMatch: true },
      },
    },
    {
      id: "5",
      name: "Emily Blunt",
      role: "UX Designer",
      score: 85,
      status: "New",
      experienceYears: 6,
      matchReason: "Creative Vision",
      skills: ["Figma", "User Research", "Prototyping"],
      missingSkills: ["HTML/CSS"],
      previousCompanies: [
        {
          name: "Airbnb",
          role: "Designer",
          duration: "3 years",
          context: "IPO",
        },
      ],
      webVerification: {
        salaryBenchmark: {
          min: 130000,
          max: 160000,
          currency: "USD",
          location: "Remote",
        },
        redFlags: [],
        linkedin: { verified: true, roleMatch: true },
      },
    },
    {
      id: "6",
      name: "James Holden",
      role: "Senior Backend Engineer",
      score: 62,
      status: "New",
      experienceYears: 4,
      matchReason: "Mismatched Tech Stack",
      skills: ["Java", "Spring", "MySQL"],
      missingSkills: ["Python", "Django"],
      previousCompanies: [
        {
          name: "Oracle",
          role: "Engineer",
          duration: "4 years",
          context: "Enterprise",
        },
      ],
      webVerification: {
        salaryBenchmark: {
          min: 140000,
          max: 170000,
          currency: "USD",
          location: "Seattle",
        },
        redFlags: [],
        linkedin: { verified: true, roleMatch: true },
      },
    },
  ];
};

const CandidateList: React.FC<CandidateListProps> = ({
  onSelectCandidate,
  onReviewCandidate,
  candidates: propCandidates,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [candidates] = useState<Candidate[]>(
    propCandidates && propCandidates.length > 0
      ? propCandidates
      : generateCandidates()
  );

  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const matchesStatus =
        filterStatus === "All" ||
        (filterStatus === "Shortlisted" &&
          (c.status === "Screening" || c.status === "Interview")) ||
        (filterStatus === "Hired" && c.status === "Offer") ||
        c.status === filterStatus;

      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.skills.some((s) =>
          s.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchesStatus && matchesSearch;
    });
  }, [candidates, filterStatus, searchQuery]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-[#3f5ecc] bg-[#eef2ff]";
    if (score >= 70) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-slate-100 text-slate-600 border-slate-200";
      case "Screening":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "Interview":
        return "bg-purple-50 text-purple-600 border-purple-200";
      case "Offer":
        return "bg-green-50 text-green-600 border-green-200";
      case "Rejected":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getApplicationStatusColor = (status?: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-300";
      case "waitlist":
        return "bg-amber-100 text-amber-700 border-amber-300";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "";
    }
  };

  const getApplicationStatusLabel = (status?: string) => {
    switch (status) {
      case "confirmed":
        return "✓ Confirmed";
      case "waitlist":
        return "⏳ Waitlist";
      case "rejected":
        return "✗ Rejected";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F9FC]">
      {/* Filters Bar */}
      <div className="bg-white border-b border-[#BDDEF3] px-4 md:px-6 py-4 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center shadow-sm sticky top-0 z-10 flex-shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 no-scrollbar">
          {["All", "New", "Shortlisted", "Interview", "Rejected"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${
                  filterStatus === status
                    ? "bg-[#3f5ecc] text-white shadow-sm"
                    : "text-slate-600 hover:bg-[#f5f7ff]"
                }`}
              >
                {status === "All" ? "All Candidates" : status}
              </button>
            )
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search name, skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#f5f7ff] border border-[#BDDEF3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3f5ecc]"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-[#BDDEF3] rounded-lg text-sm font-medium text-slate-600 hover:bg-[#f5f7ff] lg:hidden">
              <Filter className="w-4 h-4" />
            </button>
            <div className="hidden sm:flex bg-[#f5f7ff] rounded-lg border border-[#BDDEF3] p-1">
              <button className="p-1.5 bg-white shadow-sm rounded text-slate-800">
                <ListIcon className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-slate-400 hover:text-slate-600">
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {/* Mobile View (Cards) - Visible only on small screens */}
        <div className="md:hidden space-y-4">
          {filteredCandidates.map((candidate) => (
            <div
              key={candidate.id}
              onClick={() => onSelectCandidate(candidate)}
              className="bg-white p-4 rounded-xl border border-[#BDDEF3] shadow-sm active:scale-[0.99] transition-transform"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="font-bold text-slate-800">
                      {candidate.name}
                    </h3>
                    <p className="text-xs text-slate-500">{candidate.role}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${getScoreColor(
                    candidate.score
                  )}`}
                >
                  {candidate.score}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                <div className="bg-[#f5f7ff] p-2 rounded">
                  <span className="text-slate-500 block">Experience</span>
                  <span className="font-medium text-slate-800">
                    {candidate.experienceYears} Years
                  </span>
                </div>
                <div className="bg-[#f5f7ff] p-2 rounded">
                  <span className="text-slate-500 block">Status</span>
                  <span
                    className={`font-medium ${
                      getStatusColor(candidate.status).split(" ")[1]
                    }`}
                  >
                    {candidate.status}
                  </span>
                  {candidate.applicationStatus && (
                    <span
                      className={`block mt-1 text-[10px] font-medium ${
                        getApplicationStatusColor(
                          candidate.applicationStatus
                        ).split(" ")[1]
                      }`}
                    >
                      {getApplicationStatusLabel(candidate.applicationStatus)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {candidate.skills.slice(0, 3).map((skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md border border-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-[#f5f7ff] flex justify-between items-center">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />{" "}
                  {candidate.webVerification.salaryBenchmark.location}
                </span>
                <button className="text-sm font-medium text-[#3f5ecc] flex items-center gap-1">
                  View <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View (Table) - Hidden on small screens */}
        <div className="hidden md:block bg-white rounded-xl border border-[#BDDEF3] shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f5f7ff] border-b border-[#BDDEF3] text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Candidate</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Match Score</th>
                <th className="px-6 py-4">Experience</th>
                <th className="px-6 py-4">Key Skills</th>
                <th className="px-6 py-4">Market Rate</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f7ff]">
              {filteredCandidates.map((candidate) => (
                <tr
                  key={candidate.id}
                  onClick={() => onSelectCandidate(candidate)}
                  className="hover:bg-[#F8FAFC] cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {candidate.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {candidate.role}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          candidate.status
                        )}`}
                      >
                        {candidate.status}
                      </span>
                      {candidate.applicationStatus && (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-medium border ${getApplicationStatusColor(
                            candidate.applicationStatus
                          )}`}
                        >
                          {getApplicationStatusLabel(
                            candidate.applicationStatus
                          )}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-slate-100 rounded-full h-1.5 w-16">
                        <div
                          className={`h-1.5 rounded-full ${
                            candidate.score >= 90
                              ? "bg-[#3f5ecc]"
                              : candidate.score >= 70
                              ? "bg-amber-400"
                              : "bg-red-400"
                          }`}
                          style={{ width: `${candidate.score}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-slate-700">
                        {candidate.score}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600 flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      {candidate.experienceYears} Years
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills.slice(0, 2).map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded border border-slate-200"
                        >
                          {skill}
                        </span>
                      ))}
                      {candidate.skills.length > 2 && (
                        <span className="text-xs text-slate-400 px-1">
                          +{candidate.skills.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600">
                      $
                      {(
                        candidate.webVerification.salaryBenchmark.min / 1000
                      ).toFixed(0)}
                      k -{" "}
                      {(
                        candidate.webVerification.salaryBenchmark.max / 1000
                      ).toFixed(0)}
                      k
                    </p>
                    <p className="text-xs text-slate-400">
                      {candidate.webVerification.salaryBenchmark.location}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {onReviewCandidate && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onReviewCandidate(candidate);
                          }}
                          className="p-2 text-slate-400 hover:text-[#3f5ecc] hover:bg-[#eef2ff] rounded-full transition-colors opacity-0 group-hover:opacity-100"
                          title="AI Review"
                        >
                          <Brain className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCandidate(candidate);
                        }}
                        className="p-2 text-slate-400 hover:text-[#3f5ecc] hover:bg-[#eef2ff] rounded-full transition-colors opacity-0 group-hover:opacity-100"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCandidates.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 text-slate-300" />
                      <p>No candidates found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CandidateList;
