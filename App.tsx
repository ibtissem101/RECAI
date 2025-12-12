import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Settings,
  UploadCloud,
  Bell,
  Menu,
  Plus,
  Briefcase,
  LogOut,
  Check,
  Clock,
  FileText,
  UserPlus,
  Calendar,
  X,
  CheckCheck,
  MapPin,
  Search,
  ChevronRight,
} from "lucide-react";
import Dashboard from "./components/Dashboard";
import CandidateDetail from "./components/CandidateDetail";
import CandidateList from "./components/CandidateList";
import SettingsPage from "./components/SettingsPage";
import ProfilePage from "./components/ProfilePage";
import ProcessingModal from "./components/ProcessingModal";
import UploadModal from "./components/UploadModal";
import HRReviewDashboard from "./components/HRReviewDashboard";
import JobPostingPage from "./components/JobPostingPage";
import CandidateChatBot from "./components/CandidateChatBot";
import WelcomePage from "./components/WelcomePage";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import { Candidate, DashboardStats, RankedCandidatesResult } from "./types";
import { processAndRankResumes } from "./services/groqService";

// Mock Data
const mockStats: DashboardStats = {
  totalApplicants: 127,
  screened: 127,
  webResearched: 127,
  interviewsScheduled: 0,
  avgProcessingTime: "12 min",
};

const defaultCandidate: Candidate = {
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
      topLanguages: ["Python", "Go"],
      notableProject: "Django REST Framework",
      verified: true,
    },
    linkedin: { verified: true, roleMatch: true },
    salaryBenchmark: {
      min: 145000,
      max: 175000,
      currency: "USD",
      location: "San Francisco",
    },
    redFlags: [],
  },
};

// Mock notifications data
const mockNotifications = [
  {
    id: "1",
    type: "candidate",
    title: "New candidate uploaded",
    message: "Sarah Chen's resume has been processed",
    time: "2 min ago",
    read: false,
    icon: UserPlus,
    color: "from-[#3f5ecc] to-[#5a73d6]",
  },
  {
    id: "2",
    type: "interview",
    title: "Interview scheduled",
    message: "Mike Johnson - Technical Screening tomorrow at 2pm",
    time: "1 hour ago",
    read: false,
    icon: Calendar,
    color: "from-emerald-500 to-emerald-600",
  },
  {
    id: "3",
    type: "document",
    title: "Resume analysis complete",
    message: "5 resumes have been ranked for Product Manager role",
    time: "3 hours ago",
    read: true,
    icon: FileText,
    color: "from-violet-500 to-violet-600",
  },
  {
    id: "4",
    type: "reminder",
    title: "Pending review",
    message: "3 candidates are waiting for your review",
    time: "Yesterday",
    read: true,
    icon: Clock,
    color: "from-amber-500 to-amber-600",
  },
];

// Mock job postings for selection
interface JobPostingSimple {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: "Active" | "Draft" | "Closed" | "Paused";
  applicants: number;
  skills: string[];
}

const mockJobPostingsForUpload: JobPostingSimple[] = [
  {
    id: "1",
    title: "Senior Backend Engineer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    status: "Active",
    applicants: 47,
    skills: ["Python", "Django", "PostgreSQL", "AWS"],
  },
  {
    id: "2",
    title: "Product Designer",
    department: "Design",
    location: "Remote",
    type: "Remote",
    status: "Active",
    applicants: 32,
    skills: ["Figma", "User Research", "Prototyping"],
  },
  {
    id: "3",
    title: "DevOps Engineer",
    department: "Engineering",
    location: "New York, NY",
    type: "Full-time",
    status: "Active",
    applicants: 18,
    skills: ["AWS", "Docker", "Kubernetes", "Terraform"],
  },
  {
    id: "4",
    title: "Frontend Developer",
    department: "Engineering",
    location: "Austin, TX",
    type: "Full-time",
    status: "Active",
    applicants: 25,
    skills: ["React", "TypeScript", "CSS", "Next.js"],
  },
  {
    id: "5",
    title: "Data Scientist",
    department: "Data",
    location: "Remote",
    type: "Remote",
    status: "Active",
    applicants: 41,
    skills: ["Python", "Machine Learning", "SQL", "TensorFlow"],
  },
];

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showJobSelectionModal, setShowJobSelectionModal] = useState(false);
  const [selectedJobForUpload, setSelectedJobForUpload] =
    useState<JobPostingSimple | null>(null);
  const [jobSearchQuery, setJobSearchQuery] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [selectedCandidate, setSelectedCandidate] =
    useState<Candidate>(defaultCandidate);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rankedCandidates, setRankedCandidates] =
    useState<RankedCandidatesResult | null>(null);
  const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
  const [uploadedFileCount, setUploadedFileCount] = useState(0);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const startUploadFlow = () => {
    setShowJobSelectionModal(true);
  };

  const handleJobSelect = (job: JobPostingSimple) => {
    setSelectedJobForUpload(job);
    setShowJobSelectionModal(false);
    setJobSearchQuery("");
    setShowUploadModal(true);
  };

  const filteredJobs = mockJobPostingsForUpload.filter(
    (job) =>
      job.status === "Active" &&
      (job.title.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
        job.department.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
        job.skills.some((skill) =>
          skill.toLowerCase().includes(jobSearchQuery.toLowerCase())
        ))
  );

  const handleCancelProcessing = () => {
    setIsProcessing(false);
    setRankedCandidates(null);
    setUploadedFileCount(0);
  };

  const handleUploadComplete = async (files: File[]) => {
    setShowUploadModal(false);
    setIsProcessing(true);
    setUploadedFileCount(files.length);

    try {
      // Process and rank resumes using Groq AI with job-specific criteria
      const result = await processAndRankResumes(
        files,
        selectedJobForUpload?.title || "Software Engineer",
        selectedJobForUpload?.skills || [
          "JavaScript",
          "React",
          "TypeScript",
          "Node.js",
        ],
        selectedJobForUpload?.department || "Engineering",
        selectedJobForUpload?.id || "general"
      );

      // Convert to RankedCandidatesResult type (includes declined files)
      const rankedResult: RankedCandidatesResult = {
        confirmed: result.confirmed as Candidate[],
        waitlist: result.waitlist as Candidate[],
        rejected: result.rejected as Candidate[],
        allRanked: result.allRanked as Candidate[],
        declined: result.declined, // Include files that were not resumes
      };

      setRankedCandidates(rankedResult);
      setAllCandidates(rankedResult.allRanked);
    } catch (error) {
      console.error("Processing failed:", error);
      // Set empty result on error
      setRankedCandidates({
        confirmed: [],
        waitlist: [],
        rejected: [],
        allRanked: [],
      });
    }
  };

  const handleProcessingComplete = (result?: RankedCandidatesResult) => {
    setIsProcessing(false);

    if (result && result.allRanked.length > 0) {
      setSelectedCandidate(result.allRanked[0] as Candidate);
      // Navigate to candidates list to show all ranked candidates
      navigate("/dashboard/candidates");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }
    // If no valid resumes were found, just close the modal without navigating
  };

  const handleSelectCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    navigate(`/dashboard/candidates/${candidate.id}`);
  };

  const handleReviewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    navigate(`/dashboard/candidates/${candidate.id}/review`);
  };

  const handleUpdateCandidate = (updated: Candidate) => {
    setSelectedCandidate(updated);
    // Update in allCandidates array
    setAllCandidates((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    // Update in rankedCandidates if exists
    if (rankedCandidates) {
      setRankedCandidates({
        ...rankedCandidates,
        confirmed: rankedCandidates.confirmed.map((c) =>
          c.id === updated.id ? updated : c
        ),
        waitlist: rankedCandidates.waitlist.map((c) =>
          c.id === updated.id ? updated : c
        ),
        rejected: rankedCandidates.rejected.map((c) =>
          c.id === updated.id ? updated : c
        ),
        allRanked: rankedCandidates.allRanked.map((c) =>
          c.id === updated.id ? updated : c
        ),
      });
    }
  };

  const handleNavigate = (view: string) => {
    const routeMap: Record<string, string> = {
      dashboard: "/dashboard",
      candidates: "/dashboard/candidates",

      settings: "/dashboard/settings",
      profile: "/dashboard/profile",
    };
    navigate(routeMap[view] || "/dashboard");
  };

  const isActive = (path: string) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-[#eef2ff] font-sans text-slate-800">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-white border-r border-[#BDDEF3] hidden md:flex flex-col shadow-sm z-20">
        <div className="p-6 flex items-center gap-3">
          <img src="/assets/logo.webp" alt="RECAI" className="h-5 " />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-black">
              RECAI
            </h1>
            <p className="text-slate-400 text-sm font-medium">
              TalentFlow Engine
            </p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={isActive("/dashboard")}
            to="/dashboard"
          />
          <NavItem
            icon={<Users size={20} />}
            label="Candidates"
            active={isActive("/dashboard/candidates")}
            to="/dashboard/candidates"
          />
          <NavItem
            icon={<Briefcase size={20} />}
            label="Job Postings"
            active={isActive("/dashboard/job-postings")}
            to="/dashboard/job-postings"
          />
          <NavItem
            icon={<Settings size={20} />}
            label="Settings"
            active={isActive("/dashboard/settings")}
            to="/dashboard/settings"
          />
        </nav>

        <div className="p-4 border-t border-[#eef2ff]">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white z-50 transform transition-transform md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex items-center gap-3">
          <img src="/assets/logo.webp" alt="RECAI" className="w-8 h-8" />
          <h1 className="text-2xl font-bold tracking-tight text-[#3f5ecc]">
            RecAi
          </h1>
        </div>
        <nav className="px-4 space-y-2">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={isActive("/dashboard")}
            to="/dashboard"
            onClick={() => setSidebarOpen(false)}
          />
          <NavItem
            icon={<Users size={20} />}
            label="Candidates"
            active={isActive("/dashboard/candidates")}
            to="/dashboard/candidates"
            onClick={() => setSidebarOpen(false)}
          />
          <NavItem
            icon={<Briefcase size={20} />}
            label="Job Postings"
            active={isActive("/dashboard/job-postings")}
            to="/dashboard/job-postings"
            onClick={() => setSidebarOpen(false)}
          />
          <NavItem
            icon={<Settings size={20} />}
            label="Settings"
            active={isActive("/dashboard/settings")}
            to="/dashboard/settings"
            onClick={() => setSidebarOpen(false)}
          />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#F5F9FC]">
        {/* Header - Minimalist */}
        <header className="h-16 bg-white border-b border-[#BDDEF3] flex items-center justify-between px-6 shadow-sm z-10 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-slate-500"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={startUploadFlow}
              className="flex items-center gap-2 bg-[#3f5ecc] hover:bg-[#3552b8] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md shadow-[#3f5ecc]/20"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Resume</span>
            </button>
            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationPanel(!showNotificationPanel)}
                className="relative p-2 text-slate-400 hover:bg-[#eef2ff] rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 bg-gradient-to-r from-rose-500 to-rose-600 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5 ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {showNotificationPanel && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-[9998]"
                    onClick={() => setShowNotificationPanel(false)}
                  />

                  {/* Panel */}
                  <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-[9999] animate-slideDown">
                    {/* Header */}
                    <div className="px-4 py-3 bg-gradient-to-r from-[#3f5ecc] to-[#5a73d6] text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        <span className="font-semibold">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs flex items-center gap-1 hover:bg-white/10 px-2 py-1 rounded-lg transition-colors"
                        >
                          <CheckCheck className="w-4 h-4" />
                          Mark all read
                        </button>
                      )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group ${
                              !notification.read ? "bg-[#eef2ff]/50" : ""
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${notification.color} flex items-center justify-center text-white flex-shrink-0`}
                              >
                                <notification.icon className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-sm font-semibold text-slate-800 truncate">
                                    {notification.title}
                                  </p>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      clearNotification(notification.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 rounded transition-all"
                                  >
                                    <X className="w-4 h-4 text-slate-400" />
                                  </button>
                                </div>
                                <p className="text-xs text-slate-500 truncate">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {notification.time}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="w-2.5 h-2.5 bg-gradient-to-r from-[#3f5ecc] to-[#5a73d6] rounded-full flex-shrink-0" />
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-12 text-center">
                          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Bell className="w-8 h-8 text-slate-300" />
                          </div>
                          <p className="text-sm text-slate-500">
                            No notifications yet
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                      <div className="px-4 py-3 bg-slate-50 border-t border-slate-200">
                        <button
                          onClick={() => {
                            setShowNotificationPanel(false);
                            navigate("/settings");
                          }}
                          className="w-full text-center text-sm text-[#3f5ecc] font-medium hover:underline"
                        >
                          View all notifications
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            <Link
              to="/profile"
              className="w-8 h-8 rounded-full bg-[#3f5ecc] flex items-center justify-center text-white font-bold text-xs shadow-sm hover:ring-2 hover:ring-offset-1 hover:ring-[#3f5ecc] transition-all"
            >
              HR
            </Link>
          </div>
        </header>

        {/* Dynamic Main View */}
        <main className="flex-1 overflow-hidden relative flex flex-col">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  stats={mockStats}
                  onNavigate={handleNavigate}
                  onUpload={startUploadFlow}
                />
              }
            />
            <Route
              path="/candidates"
              element={
                <CandidateList
                  onSelectCandidate={handleSelectCandidate}
                  onReviewCandidate={handleReviewCandidate}
                  candidates={allCandidates}
                />
              }
            />
            <Route
              path="/candidates/:id"
              element={
                <CandidateDetail
                  candidate={selectedCandidate}
                  onBack={() => navigate("/dashboard/candidates")}
                />
              }
            />
            <Route
              path="/candidates/:id/review"
              element={
                <HRReviewDashboard
                  candidate={selectedCandidate}
                  onUpdateCandidate={handleUpdateCandidate}
                  onBack={() =>
                    navigate(`/dashboard/candidates/${selectedCandidate.id}`)
                  }
                />
              }
            />

            <Route path="/job-postings" element={<JobPostingPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>

        <ProcessingModal
          isOpen={isProcessing}
          onComplete={handleProcessingComplete}
          onCancel={handleCancelProcessing}
          processingResult={rankedCandidates}
          fileCount={uploadedFileCount}
        />

        {/* Job Selection Modal */}
        {showJobSelectionModal && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => {
                setShowJobSelectionModal(false);
                setJobSearchQuery("");
              }}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden animate-slideDown">
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-[#3f5ecc] to-[#5a73d6] text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">
                          Select Job Posting
                        </h2>
                        <p className="text-sm text-white/80">
                          Choose where to upload resumes
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowJobSelectionModal(false);
                        setJobSearchQuery("");
                      }}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-slate-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search jobs by title, department, or skills..."
                      value={jobSearchQuery}
                      onChange={(e) => setJobSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3f5ecc] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Job List */}
                <div className="max-h-[50vh] overflow-y-auto p-4 space-y-3">
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                      <button
                        key={job.id}
                        onClick={() => handleJobSelect(job)}
                        className="w-full p-4 bg-white border border-slate-200 rounded-xl hover:border-[#3f5ecc] hover:shadow-lg hover:shadow-[#3f5ecc]/10 transition-all duration-300 text-left group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-slate-800 group-hover:text-[#3f5ecc] transition-colors">
                                {job.title}
                              </h3>
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                                {job.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                              <span className="flex items-center gap-1">
                                <Briefcase className="w-3.5 h-3.5" />
                                {job.department}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5" />
                                {job.applicants} applicants
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {job.skills.slice(0, 4).map((skill) => (
                                <span
                                  key={skill}
                                  className="px-2 py-1 bg-[#eef2ff] text-[#3f5ecc] text-xs font-medium rounded-lg"
                                >
                                  {skill}
                                </span>
                              ))}
                              {job.skills.length > 4 && (
                                <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs font-medium rounded-lg">
                                  +{job.skills.length - 4} more
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#3f5ecc] group-hover:translate-x-1 transition-all" />
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="py-12 text-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Briefcase className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="text-sm text-slate-500">
                        No active job postings found
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Try a different search term
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                  <p className="text-sm text-slate-500">
                    {filteredJobs.length} active job
                    {filteredJobs.length !== 1 ? "s" : ""} available
                  </p>
                  <button
                    onClick={() => {
                      setShowJobSelectionModal(false);
                      setJobSearchQuery("");
                      navigate("/dashboard/job-postings");
                    }}
                    className="text-sm text-[#3f5ecc] font-medium hover:underline flex items-center gap-1"
                  >
                    Manage Job Postings <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        <UploadModal
          isOpen={showUploadModal}
          onClose={() => {
            setShowUploadModal(false);
            setSelectedJobForUpload(null);
          }}
          onUpload={handleUploadComplete}
          selectedJob={selectedJobForUpload}
        />

        {/* AI Candidate Search Chatbot */}
        <CandidateChatBot
          candidates={allCandidates}
          onSelectCandidate={handleSelectCandidate}
        />

        {/* Toast Notification */}
        {showNotification && (
          <div className="absolute bottom-6 right-6 bg-[#3f5ecc] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 shadow-[#3f5ecc]/20 z-50">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <Plus className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Analysis Complete</h4>
              <p className="text-xs text-white/80">
                {selectedCandidate.name} is ready for review.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const NavItem = ({
  icon,
  label,
  active,
  to,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  to: string;
  onClick?: () => void;
}) => (
  <Link
    to={to}
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
      active
        ? "bg-[#eef2ff] text-[#3f5ecc]"
        : "text-slate-500 hover:text-[#3f5ecc] hover:bg-[#f5f7ff]"
    }`}
  >
    {icon}
    {label}
  </Link>
);

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Dashboard Routes (with sidebar layout) */}
        <Route path="/dashboard/*" element={<AppContent />} />
      </Routes>
    </Router>
  );
};

export default App;
