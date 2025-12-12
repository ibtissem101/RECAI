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
import { Candidate, DashboardStats, RankedCandidatesResult } from "./types";
import { processAndRankResumes } from "./services/geminiService";

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

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [selectedCandidate, setSelectedCandidate] =
    useState<Candidate>(defaultCandidate);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rankedCandidates, setRankedCandidates] =
    useState<RankedCandidatesResult | null>(null);
  const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
  const [uploadedFileCount, setUploadedFileCount] = useState(0);

  const startUploadFlow = () => {
    setShowUploadModal(true);
  };

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
      // Process and rank resumes using Gemini AI
      const result = await processAndRankResumes(files);

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
      navigate("/candidates");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }
    // If no valid resumes were found, just close the modal without navigating
  };

  const handleSelectCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    navigate(`/candidates/${candidate.id}`);
  };

  const handleReviewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    navigate(`/candidates/${candidate.id}/review`);
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
      dashboard: "/",
      candidates: "/candidates",

      settings: "/settings",
      profile: "/profile",
    };
    navigate(routeMap[view] || "/");
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
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
            active={isActive("/")}
            to="/"
          />
          <NavItem
            icon={<Users size={20} />}
            label="Candidates"
            active={isActive("/candidates")}
            to="/candidates"
          />
          <NavItem
            icon={<Briefcase size={20} />}
            label="Job Postings"
            active={isActive("/job-postings")}
            to="/job-postings"
          />
          <NavItem
            icon={<Settings size={20} />}
            label="Settings"
            active={isActive("/settings")}
            to="/settings"
          />
        </nav>

        <div className="p-4 border-t border-[#eef2ff]">
          <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors">
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
            active={isActive("/")}
            to="/"
            onClick={() => setSidebarOpen(false)}
          />
          <NavItem
            icon={<Users size={20} />}
            label="Candidates"
            active={isActive("/candidates")}
            to="/candidates"
            onClick={() => setSidebarOpen(false)}
          />
          <NavItem
            icon={<Briefcase size={20} />}
            label="Job Postings"
            active={isActive("/job-postings")}
            to="/job-postings"
            onClick={() => setSidebarOpen(false)}
          />
          <NavItem
            icon={<Settings size={20} />}
            label="Settings"
            active={isActive("/settings")}
            to="/settings"
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
            <button className="relative p-2 text-slate-400 hover:bg-[#eef2ff] rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              {showNotification && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#E9C7DB] rounded-full ring-2 ring-white"></span>
              )}
            </button>
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
                  onBack={() => navigate("/candidates")}
                />
              }
            />
            <Route
              path="/candidates/:id/review"
              element={
                <HRReviewDashboard
                  candidate={selectedCandidate}
                  onUpdateCandidate={handleUpdateCandidate}
                  onBack={() => navigate(`/candidates/${selectedCandidate.id}`)}
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
        <UploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUploadComplete}
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
      <AppContent />
    </Router>
  );
};

export default App;
