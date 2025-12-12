import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import { LayoutDashboard, Users, FileText, Settings, UploadCloud, Bell, Menu, Plus, LineChart, LogOut, Home } from 'lucide-react';
import Dashboard from './components/Dashboard';
import CandidateDetail from './components/CandidateDetail';
import CandidateList from './components/CandidateList';
import MarketIntel from './components/MarketIntel';
import SettingsPage from './components/SettingsPage';
import ProfilePage from './components/ProfilePage';
import ProcessingModal from './components/ProcessingModal';
import UploadModal from './components/UploadModal';
import WelcomePage from './components/WelcomePage';
import LoginPage from './components/LoginPage';  // Add LoginPage
import SignUpPage from './components/SignUpPage';  // Add SignUpPage
import { Candidate, DashboardStats } from './types';
import './index.css';
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

type AppView = 'welcome' | 'dashboard' | 'candidates' | 'market_intel' | 'candidate_detail' | 'settings' | 'profile';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('welcome');
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
    setIsProcessing(true);
  };

  const handleProcessingComplete = () => {
    setIsProcessing(false);
    setSelectedCandidate(defaultCandidate); 
    setCurrentView('candidate_detail');
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const handleSelectCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setCurrentView('candidate_detail');
  };

  const handleGetStarted = () => {
    setCurrentView('dashboard');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'welcome':
        return <WelcomePage onGetStarted={handleGetStarted} />;
      case 'dashboard':
        return <Dashboard 
            stats={mockStats} 
            onNavigate={(view) => setCurrentView(view as AppView)} 
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
            onNavigate={(view) => setCurrentView(view as AppView)} 
            onUpload={startUploadFlow}
        />;
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage onGetStarted={handleGetStarted} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<Dashboard 
            stats={mockStats} 
            onNavigate={(view) => setCurrentView(view as AppView)} 
            onUpload={startUploadFlow}
        />} />
        {/* Additional routes can be added here */}
      </Routes>
    </Router>
  );
};

export default App;
