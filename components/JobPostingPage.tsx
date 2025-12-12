import React, { useState } from "react";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  ArrowLeft,
  UploadCloud,
  FileText,
  Mail,
  Star,
  MoreVertical,
  X,
} from "lucide-react";

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
  salaryMin: number;
  salaryMax: number;
  status: "Active" | "Draft" | "Closed" | "Paused";
  applicants: number;
  postedDate: string;
  closingDate?: string;
  description: string;
  requirements: string[];
  skills: string[];
}

interface JobCandidate {
  id: string;
  name: string;
  email: string;
  score: number;
  status:
    | "New"
    | "Screening"
    | "Shortlisted"
    | "Interview"
    | "Rejected"
    | "Hired";
  appliedDate: string;
  experience: string;
  skills: string[];
  matchPercent: number;
}

const mockJobPostings: JobPosting[] = [
  {
    id: "1",
    title: "Senior Backend Engineer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    salaryMin: 140000,
    salaryMax: 180000,
    status: "Active",
    applicants: 47,
    postedDate: "2024-12-01",
    closingDate: "2025-01-15",
    description:
      "We are looking for a Senior Backend Engineer to join our team...",
    requirements: [
      "5+ years of experience",
      "Strong Python skills",
      "Experience with distributed systems",
    ],
    skills: ["Python", "Django", "PostgreSQL", "AWS", "Kubernetes"],
  },
  {
    id: "2",
    title: "Product Designer",
    department: "Design",
    location: "Remote",
    type: "Remote",
    salaryMin: 100000,
    salaryMax: 140000,
    status: "Active",
    applicants: 32,
    postedDate: "2024-12-05",
    closingDate: "2025-01-20",
    description: "Join our design team to create beautiful user experiences...",
    requirements: [
      "3+ years of product design experience",
      "Proficiency in Figma",
      "Portfolio required",
    ],
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
  },
  {
    id: "3",
    title: "DevOps Engineer",
    department: "Engineering",
    location: "New York, NY",
    type: "Full-time",
    salaryMin: 130000,
    salaryMax: 170000,
    status: "Draft",
    applicants: 0,
    postedDate: "2024-12-10",
    description:
      "Looking for a DevOps engineer to improve our CI/CD pipelines...",
    requirements: [
      "4+ years DevOps experience",
      "Strong Linux skills",
      "Cloud certifications preferred",
    ],
    skills: ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins"],
  },
  {
    id: "4",
    title: "Marketing Manager",
    department: "Marketing",
    location: "Austin, TX",
    type: "Full-time",
    salaryMin: 90000,
    salaryMax: 120000,
    status: "Closed",
    applicants: 89,
    postedDate: "2024-11-01",
    closingDate: "2024-12-01",
    description: "Lead our marketing initiatives and brand strategy...",
    requirements: [
      "5+ years marketing experience",
      "B2B SaaS background",
      "MBA preferred",
    ],
    skills: ["Digital Marketing", "Content Strategy", "Analytics", "SEO"],
  },
];

// Mock candidates for each job
const mockJobCandidates: Record<string, JobCandidate[]> = {
  "1": [
    {
      id: "c1",
      name: "Sarah Chen",
      email: "sarah.chen@email.com",
      score: 94,
      status: "Shortlisted",
      appliedDate: "2024-12-03",
      experience: "8 years",
      skills: ["Python", "Django", "AWS"],
      matchPercent: 95,
    },
    {
      id: "c2",
      name: "Michael Park",
      email: "m.park@email.com",
      score: 87,
      status: "Interview",
      appliedDate: "2024-12-04",
      experience: "6 years",
      skills: ["Python", "PostgreSQL", "Docker"],
      matchPercent: 88,
    },
    {
      id: "c3",
      name: "Emily Rodriguez",
      email: "emily.r@email.com",
      score: 82,
      status: "Screening",
      appliedDate: "2024-12-05",
      experience: "5 years",
      skills: ["Python", "FastAPI", "AWS"],
      matchPercent: 82,
    },
    {
      id: "c4",
      name: "James Wilson",
      email: "j.wilson@email.com",
      score: 78,
      status: "New",
      appliedDate: "2024-12-06",
      experience: "4 years",
      skills: ["Python", "Django"],
      matchPercent: 75,
    },
    {
      id: "c5",
      name: "Lisa Thompson",
      email: "lisa.t@email.com",
      score: 91,
      status: "Shortlisted",
      appliedDate: "2024-12-02",
      experience: "7 years",
      skills: ["Python", "Kubernetes", "AWS"],
      matchPercent: 92,
    },
  ],
  "2": [
    {
      id: "c6",
      name: "Alex Kim",
      email: "alex.kim@email.com",
      score: 89,
      status: "Interview",
      appliedDate: "2024-12-06",
      experience: "4 years",
      skills: ["Figma", "User Research"],
      matchPercent: 90,
    },
    {
      id: "c7",
      name: "Jordan Lee",
      email: "jordan.l@email.com",
      score: 85,
      status: "Screening",
      appliedDate: "2024-12-07",
      experience: "3 years",
      skills: ["Figma", "Prototyping"],
      matchPercent: 85,
    },
  ],
  "4": [
    {
      id: "c8",
      name: "Chris Brown",
      email: "chris.b@email.com",
      score: 88,
      status: "Hired",
      appliedDate: "2024-11-05",
      experience: "6 years",
      skills: ["Digital Marketing", "SEO"],
      matchPercent: 88,
    },
  ],
};

const JobPostingPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobPosting[]>(mockJobPostings);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [candidates, setCandidates] =
    useState<Record<string, JobCandidate[]>>(mockJobCandidates);

  // If a job is selected, show the detail view
  if (selectedJob) {
    return (
      <JobDetailView
        job={selectedJob}
        candidates={candidates[selectedJob.id] || []}
        onBack={() => setSelectedJob(null)}
        onUploadResumes={(newCandidates) => {
          setCandidates((prev) => ({
            ...prev,
            [selectedJob.id]: [
              ...(prev[selectedJob.id] || []),
              ...newCandidates,
            ],
          }));
          // Update applicant count
          setJobs((prev) =>
            prev.map((j) =>
              j.id === selectedJob.id
                ? { ...j, applicants: j.applicants + newCandidates.length }
                : j
            )
          );
        }}
      />
    );
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-blue-100 text-blue-700";
      case "Draft":
        return "bg-slate-100 text-slate-600";
      case "Closed":
        return "bg-red-100 text-red-700";
      case "Paused":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="w-3 h-3" />;
      case "Closed":
        return <XCircle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const handleDeleteJob = (id: string) => {
    if (confirm("Are you sure you want to delete this job posting?")) {
      setJobs(jobs.filter((job) => job.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setJobs(
      jobs.map((job) => {
        if (job.id === id) {
          const newStatus =
            job.status === "Active"
              ? "Paused"
              : job.status === "Paused"
              ? "Active"
              : job.status === "Draft"
              ? "Active"
              : job.status;
          return { ...job, status: newStatus };
        }
        return job;
      })
    );
  };

  const stats = {
    total: jobs.length,
    active: jobs.filter((j) => j.status === "Active").length,
    totalApplicants: jobs.reduce((sum, j) => sum + j.applicants, 0),
    drafts: jobs.filter((j) => j.status === "Draft").length,
  };

  return (
    <div className="p-8 overflow-y-auto h-full space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Manage Job Postings
          </h2>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-[#3f5ecc] hover:bg-[#3552b8] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-md shadow-[#3f5ecc]/20"
        >
          <Plus className="w-4 h-4" />
          Create Job Posting
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#BDDEF3] p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#eef2ff] rounded-lg">
              <Briefcase className="w-5 h-5 text-[#3f5ecc]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              <p className="text-xs text-slate-500">Total Jobs</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#BDDEF3] p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {stats.active}
              </p>
              <p className="text-xs text-slate-500">Active Postings</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#BDDEF3] p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#E9C7DB]/30 rounded-lg">
              <Users className="w-5 h-5 text-[#E9C7DB]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {stats.totalApplicants}
              </p>
              <p className="text-xs text-slate-500">Total Applicants</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#BDDEF3] p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-100 rounded-lg">
              <Edit3 className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {stats.drafts}
              </p>
              <p className="text-xs text-slate-500">Drafts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search job postings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#BDDEF3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3f5ecc]/20 focus:border-[#3f5ecc]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-[#BDDEF3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3f5ecc]/20 focus:border-[#3f5ecc]"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Paused">Paused</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Job Listings Table */}
      <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#f5f7ff] border-b border-[#BDDEF3]">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Job Title
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Location
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Salary Range
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Applicants
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#BDDEF3]">
            {filteredJobs.map((job) => (
              <tr
                key={job.id}
                className="hover:bg-[#F5F9FC] transition-colors cursor-pointer"
                onClick={() => setSelectedJob(job)}
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-slate-800">{job.title}</p>
                    <p className="text-xs text-slate-500">
                      {job.department} • {job.type}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.location}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" />$
                    {(job.salaryMin / 1000).toFixed(0)}k - $
                    {(job.salaryMax / 1000).toFixed(0)}k
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {job.applicants}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      job.status
                    )}`}
                  >
                    {getStatusIcon(job.status)}
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="p-2 text-slate-400 hover:text-[#3f5ecc] hover:bg-[#eef2ff] rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(job.id)}
                      className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      title={job.status === "Active" ? "Pause" : "Activate"}
                    >
                      {job.status === "Active" ? (
                        <Clock className="w-4 h-4" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No job postings found</p>
            <p className="text-sm text-slate-400">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* Create Job Modal */}
      {showCreateModal && (
        <CreateJobModal
          onClose={() => setShowCreateModal(false)}
          onSave={(newJob) => {
            setJobs([
              ...jobs,
              {
                ...newJob,
                id: String(jobs.length + 1),
                applicants: 0,
                postedDate: new Date().toISOString().split("T")[0],
              },
            ]);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
};

interface CreateJobModalProps {
  onClose: () => void;
  onSave: (job: Omit<JobPosting, "id" | "applicants" | "postedDate">) => void;
}

const CreateJobModal: React.FC<CreateJobModalProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    type: "Full-time" as JobPosting["type"],
    salaryMin: 0,
    salaryMax: 0,
    status: "Draft" as JobPosting["status"],
    closingDate: "",
    description: "",
    requirements: [""],
    skills: [""],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      requirements: formData.requirements.filter((r) => r.trim()),
      skills: formData.skills.filter((s) => s.trim()),
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-6 border-b border-[#BDDEF3]">
          <h3 className="text-xl font-bold text-slate-800">
            Create New Job Posting
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Fill in the details to create a new job posting
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-[#BDDEF3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3f5ecc]/20 focus:border-[#3f5ecc]"
                placeholder="e.g., Senior Software Engineer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Department *
              </label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-[#BDDEF3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3f5ecc]/20 focus:border-[#3f5ecc]"
                placeholder="e.g., Engineering"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-[#BDDEF3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3f5ecc]/20 focus:border-[#3f5ecc]"
                placeholder="e.g., San Francisco, CA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Job Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as JobPosting["type"],
                  })
                }
                className="w-full px-4 py-2.5 border border-[#BDDEF3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3f5ecc]/20 focus:border-[#3f5ecc]"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Salary Min ($)
              </label>
              <input
                type="number"
                value={formData.salaryMin || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    salaryMin: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-2.5 border border-[#BDDEF3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3f5ecc]/20 focus:border-[#3f5ecc]"
                placeholder="e.g., 100000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Salary Max ($)
              </label>
              <input
                type="number"
                value={formData.salaryMax || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    salaryMax: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-2.5 border border-[#BDDEF3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3f5ecc]/20 focus:border-[#3f5ecc]"
                placeholder="e.g., 150000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Job Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2.5 border border-[#BDDEF3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3f5ecc]/20 focus:border-[#3f5ecc] resize-none"
              placeholder="Describe the role and responsibilities..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Required Skills
            </label>
            <input
              type="text"
              value={formData.skills.join(", ")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  skills: e.target.value.split(",").map((s) => s.trim()),
                })
              }
              className="w-full px-4 py-2.5 border border-[#BDDEF3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3f5ecc]/20 focus:border-[#3f5ecc]"
              placeholder="e.g., Python, Django, AWS (comma separated)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as JobPosting["status"],
                  })
                }
                className="w-full px-4 py-2.5 border border-[#BDDEF3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3f5ecc]/20 focus:border-[#3f5ecc]"
              >
                <option value="Draft">Draft</option>
                <option value="Active">Active</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Closing Date
              </label>
              <input
                type="date"
                value={formData.closingDate}
                onChange={(e) =>
                  setFormData({ ...formData, closingDate: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-[#BDDEF3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3f5ecc]/20 focus:border-[#3f5ecc]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#BDDEF3]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#3f5ecc] hover:bg-[#3552b8] text-white rounded-lg text-sm font-medium transition-colors shadow-md shadow-[#3f5ecc]/20"
            >
              Create Job Posting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Job Detail View - Full page view with candidates
interface JobDetailViewProps {
  job: JobPosting;
  candidates: JobCandidate[];
  onBack: () => void;
  onUploadResumes: (candidates: JobCandidate[]) => void;
}

const JobDetailView: React.FC<JobDetailViewProps> = ({
  job,
  candidates,
  onBack,
  onUploadResumes,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showUploadModal, setShowUploadModal] = useState(false);

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || candidate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getCandidateStatusColor = (status: string) => {
    switch (status) {
      case "Shortlisted":
        return "bg-blue-100 text-blue-700";
      case "Interview":
        return "bg-blue-100 text-blue-700";
      case "Hired":
        return "bg-[#eef2ff] text-[#3f5ecc]";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "Screening":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-blue-600 bg-blue-50";
    if (score >= 80) return "text-blue-600 bg-blue-50";
    if (score >= 70) return "text-amber-600 bg-amber-50";
    return "text-slate-600 bg-slate-50";
  };

  const stats = {
    total: candidates.length,
    shortlisted: candidates.filter((c) => c.status === "Shortlisted").length,
    interview: candidates.filter((c) => c.status === "Interview").length,
    hired: candidates.filter((c) => c.status === "Hired").length,
  };

  return (
    <div className="p-8 overflow-y-auto h-full space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-[#eef2ff] rounded-lg transition-colors text-slate-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <p className="text-sm text-slate-500 mb-1">Job Posting</p>
            <h1 className="text-2xl font-bold text-slate-800">{job.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm text-slate-500">{job.department}</span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 text-sm text-slate-500">
                <MapPin className="w-3.5 h-3.5" /> {job.location}
              </span>
              <span className="text-slate-300">•</span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                  job.status === "Active"
                    ? "bg-blue-100 text-blue-700"
                    : job.status === "Draft"
                    ? "bg-slate-100 text-slate-600"
                    : job.status === "Closed"
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {job.status}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 bg-[#3f5ecc] hover:bg-[#3552b8] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-md shadow-[#3f5ecc]/20"
        >
          <UploadCloud className="w-4 h-4" />
          Upload Resumes
        </button>
      </div>

      {/* Job Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#BDDEF3] p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#eef2ff] rounded-lg">
              <Users className="w-5 h-5 text-[#3f5ecc]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              <p className="text-xs text-slate-500">Total Applicants</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#BDDEF3] p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Star className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {stats.shortlisted}
              </p>
              <p className="text-xs text-slate-500">Shortlisted</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#BDDEF3] p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {stats.interview}
              </p>
              <p className="text-xs text-slate-500">In Interview</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#BDDEF3] p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#E9C7DB]/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-[#3f5ecc]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.hired}</p>
              <p className="text-xs text-slate-500">Hired</p>
            </div>
          </div>
        </div>
      </div>

      {/* Job Details Collapsible */}
      <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-slate-800 mb-3">Job Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <DollarSign className="w-4 h-4 text-slate-400" />
                <span>
                  Salary: ${(job.salaryMin / 1000).toFixed(0)}k - $
                  {(job.salaryMax / 1000).toFixed(0)}k
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Briefcase className="w-4 h-4 text-slate-400" />
                <span>Type: {job.type}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Posted: {job.postedDate}</span>
              </div>
              {job.closingDate && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Closes: {job.closingDate}</span>
                </div>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 mb-3">
              Required Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-[#eef2ff] text-[#3f5ecc] rounded-full text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Candidates Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Candidates</h2>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-[#BDDEF3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3f5ecc]/20 focus:border-[#3f5ecc] w-64"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-[#BDDEF3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3f5ecc]/20 focus:border-[#3f5ecc]"
            >
              <option value="All">All Status</option>
              <option value="New">New</option>
              <option value="Screening">Screening</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Candidates Table */}
        <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#f5f7ff] border-b border-[#BDDEF3]">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Match
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Experience
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Applied
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#BDDEF3]">
              {filteredCandidates.map((candidate) => (
                <tr
                  key={candidate.id}
                  className="hover:bg-[#F5F9FC] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#3f5ecc] text-white flex items-center justify-center text-sm font-bold">
                        {candidate.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">
                          {candidate.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {candidate.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold ${getScoreColor(
                        candidate.score
                      )}`}
                    >
                      {candidate.score}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#3f5ecc] rounded-full"
                          style={{ width: `${candidate.matchPercent}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-600">
                        {candidate.matchPercent}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {candidate.experience}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getCandidateStatusColor(
                        candidate.status
                      )}`}
                    >
                      {candidate.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {candidate.appliedDate}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-2 text-slate-400 hover:text-[#3f5ecc] hover:bg-[#eef2ff] rounded-lg transition-colors"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Send Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="More Actions"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCandidates.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No candidates found</p>
              <p className="text-sm text-slate-400 mt-1">
                {candidates.length === 0
                  ? "Upload resumes to start receiving applications"
                  : "Try adjusting your search or filters"}
              </p>
              {candidates.length === 0 && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="mt-4 inline-flex items-center gap-2 bg-[#3f5ecc] hover:bg-[#3552b8] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <UploadCloud className="w-4 h-4" />
                  Upload Resumes
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <JobUploadModal
          jobTitle={job.title}
          onClose={() => setShowUploadModal(false)}
          onUpload={(files) => {
            // Create mock candidates from uploaded files
            const newCandidates: JobCandidate[] = files.map((file, index) => ({
              id: `new-${Date.now()}-${index}`,
              name: file.name.replace(".pdf", "").replace(/_/g, " "),
              email: `candidate${Date.now() + index}@email.com`,
              score: Math.floor(Math.random() * 30) + 70,
              status: "New" as const,
              appliedDate: new Date().toISOString().split("T")[0],
              experience: `${Math.floor(Math.random() * 8) + 2} years`,
              skills: job.skills.slice(0, Math.floor(Math.random() * 3) + 2),
              matchPercent: Math.floor(Math.random() * 25) + 70,
            }));
            onUploadResumes(newCandidates);
            setShowUploadModal(false);
          }}
        />
      )}
    </div>
  );
};

// Upload Modal for Job-specific uploads
interface JobUploadModalProps {
  jobTitle: string;
  onClose: () => void;
  onUpload: (files: File[]) => void;
}

const JobUploadModal: React.FC<JobUploadModalProps> = ({
  jobTitle,
  onClose,
  onUpload,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files).filter(
        (file) => file.type === "application/pdf"
      );
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(
        (file) => file.type === "application/pdf"
      );
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#BDDEF3] flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Upload Resumes</h2>
            <p className="text-sm text-slate-500 mt-1">For: {jobTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Drop Zone */}
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer
              ${
                dragActive
                  ? "border-[#3f5ecc] bg-[#f5f7ff]"
                  : "border-slate-300 hover:border-[#3f5ecc] hover:bg-slate-50"
              }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              accept=".pdf"
              className="hidden"
              onChange={handleChange}
            />
            <div className="w-16 h-16 bg-[#eef2ff] rounded-full flex items-center justify-center mb-4">
              <UploadCloud className="w-8 h-8 text-[#3f5ecc]" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">
              Click to upload or drag and drop
            </h3>
            <p className="text-slate-500 mt-1">
              PDF files only (Max 10MB per file)
            </p>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="text-sm font-semibold text-slate-700">
                Ready to process ({files.length})
              </h4>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-[#f5f7ff] rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[#3f5ecc]" />
                      <div>
                        <p className="text-sm font-medium text-slate-700 truncate max-w-xs">
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="p-1.5 hover:bg-red-100 rounded-full text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-[#BDDEF3] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onUpload(files)}
            disabled={files.length === 0}
            className="px-5 py-2.5 bg-[#3f5ecc] hover:bg-[#3552b8] text-white rounded-lg text-sm font-medium transition-colors shadow-md shadow-[#3f5ecc]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Upload & Process ({files.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobPostingPage;
