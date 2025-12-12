import React, { useState } from 'react';
import { LayoutDashboard, Users, FileText, Settings, UploadCloud, Bell, Menu, Plus, LineChart, LogOut } from 'lucide-react';
import Dashboard from './components/Dashboard';
import CandidateDetail from './components/CandidateDetail';
import CandidateList from './components/CandidateList';
import MarketIntel from './components/MarketIntel';
import SettingsPage from './components/SettingsPage';
import ProfilePage from './components/ProfilePage';
import ProcessingModal from './components/ProcessingModal';
import UploadModal from './components/UploadModal';
import { Candidate, DashboardStats } from './types';

// Mock Data
const mockStats: DashboardStats = {
  totalApplicants: 127,
  screened: 127,
  webResearched: 127,
  interviewsScheduled: 0,
  avgProcessingTime: '12 min'
};

const defaultCandidate: Candidate = {
  id: '1',
  name: 'Sarah Chen',
  role: 'Senior Backend Engineer',
  score: 94,
  status: 'New',
  experienceYears: 8,
  matchReason: 'Strong Skill Match',
  skills: ['Python', 'Django', 'PostgreSQL', 'AWS'],
  missingSkills: ['Kubernetes'],
  previousCompanies: [
    { name: 'Stripe', role: 'Senior Engineer', duration: '4 years', context: 'Series C to IPO' }
  ],
  webVerification: {
    github: {
      handle: '@sarahchen',
      contributions: 847,
      topLanguages: ['Python', 'Go'],
      notableProject: 'Django REST Framework',
      verified: true
    },
    linkedin: { verified: true, roleMatch: true },
    salaryBenchmark: { min: 145000, max: 175000, currency: 'USD', location: 'San Francisco' },
    redFlags: []
  }
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'candidates' | 'market_intel' | 'candidate_detail' | 'settings' | 'profile'>('dashboard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate>(defaultCandidate);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const startUploadFlow = () => {
    setShowUploadModal(true);
  };

  const handleUploadComplete = (files: File[]) => {
    setShowUploadModal(false);
    // In a real app, we would upload the files here.
    // For now, we simulate the processing of these files.
    setIsProcessing(true);
  };

  const handleProcessingComplete = () => {
    setIsProcessing(false);
    // In a real flow, the processed result would be set as the selected candidate
    setSelectedCandidate(defaultCandidate); 
    setCurrentView('candidate_detail');
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const handleSelectCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setCurrentView('candidate_detail');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard 
            stats={mockStats} 
            onNavigate={(view) => setCurrentView(view as any)} 
            onUpload={startUploadFlow}
        />;
      case 'candidates':
        return <CandidateList onSelectCandidate={handleSelectCandidate} />;
      case 'market_intel':
        return <MarketIntel />;
      case 'candidate_detail':
        return <CandidateDetail candidate={selectedCandidate} onBack={() => setCurrentView('candidates')} />;
      case 'settings':
        return <SettingsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <Dashboard 
            stats={mockStats} 
            onNavigate={(view) => setCurrentView(view as any)} 
            onUpload={startUploadFlow}
        />;
    }
  };

  return (
    <div className="flex h-screen bg-[#D7E9F4] font-sans text-slate-800">
      
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-white border-r border-[#BDDEF3] hidden md:flex flex-col shadow-sm z-20">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight text-[#1BB0A3]">RecAi</h1>
          <p className="text-slate-400 text-sm font-medium">TalentFlow Engine</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
          <NavItem icon={<Users size={20} />} label="Candidates" active={currentView === 'candidates' || currentView === 'candidate_detail'} onClick={() => setCurrentView('candidates')} />
          <NavItem icon={<LineChart size={20} />} label="Market Intel" active={currentView === 'market_intel'} onClick={() => setCurrentView('market_intel')} />
          <NavItem icon={<Settings size={20} />} label="Settings" active={currentView === 'settings'} onClick={() => setCurrentView('settings')} />
        </nav>

        <div className="p-4 border-t border-[#D7E9F4]">
            <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors">
                <LogOut size={20} />
                Log Out
            </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-white z-50 transform transition-transform md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
         <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight text-[#1BB0A3]">RecAi</h1>
        </div>
         <nav className="px-4 space-y-2">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={currentView === 'dashboard'} onClick={() => { setCurrentView('dashboard'); setSidebarOpen(false); }} />
          <NavItem icon={<Users size={20} />} label="Candidates" active={currentView === 'candidates' || currentView === 'candidate_detail'} onClick={() => { setCurrentView('candidates'); setSidebarOpen(false); }} />
          <NavItem icon={<LineChart size={20} />} label="Market Intel" active={currentView === 'market_intel'} onClick={() => { setCurrentView('market_intel'); setSidebarOpen(false); }} />
          <NavItem icon={<Settings size={20} />} label="Settings" active={currentView === 'settings'} onClick={() => { setCurrentView('settings'); setSidebarOpen(false); }} />
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
                    className="flex items-center gap-2 bg-[#1BB0A3] hover:bg-[#15968b] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md shadow-[#1BB0A3]/20"
                >
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload Resume</span>
                </button>
                <button className="relative p-2 text-slate-400 hover:bg-[#D7E9F4] rounded-lg transition-colors">
                    <Bell className="w-5 h-5" />
                    {showNotification && <span className="absolute top-2 right-2 w-2 h-2 bg-[#E9C7DB] rounded-full ring-2 ring-white"></span>}
                </button>
                <button 
                    onClick={() => setCurrentView('profile')}
                    className="w-8 h-8 rounded-full bg-[#1BB0A3] flex items-center justify-center text-white font-bold text-xs shadow-sm hover:ring-2 hover:ring-offset-1 hover:ring-[#1BB0A3] transition-all"
                >
                    HR
                </button>
            </div>
        </header>

        {/* Dynamic Main View */}
        <main className="flex-1 overflow-hidden relative flex flex-col">
            {renderContent()}
        </main>

        <ProcessingModal isOpen={isProcessing} onComplete={handleProcessingComplete} />
        <UploadModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} onUpload={handleUploadComplete} />
        
        {/* Toast Notification */}
        {showNotification && (
            <div className="absolute bottom-6 right-6 bg-[#1BB0A3] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 shadow-[#1BB0A3]/20 z-50">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Plus className="w-4 h-4 text-white" />
                </div>
                <div>
                    <h4 className="font-medium text-sm">Analysis Complete</h4>
                    <p className="text-xs text-white/80">{selectedCandidate.name} is ready for review.</p>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            active 
            ? 'bg-[#D7E9F4] text-[#1BB0A3]' 
            : 'text-slate-500 hover:text-[#1BB0A3] hover:bg-[#F0F7FB]'
        }`}
    >
        {icon}
        {label}
    </button>
);

export default App;