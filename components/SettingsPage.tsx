import React, { useState } from "react";
import {
  Bell,
  Globe,
  Users,
  Database,
  Save,
  Shield,
  Palette,
  Mail,
  Key,
  Check,
  ChevronRight,
  Zap,
  Brain,
} from "lucide-react";

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: "general", label: "General", icon: <Globe className="w-4 h-4" /> },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="w-4 h-4" />,
    },
    { id: "team", label: "Team Access", icon: <Users className="w-4 h-4" /> },
    {
      id: "integrations",
      label: "Integrations",
      icon: <Database className="w-4 h-4" />,
    },
    { id: "ai", label: "AI Settings", icon: <Brain className="w-4 h-4" /> },
    {
      id: "security",
      label: "Security",
      icon: <Shield className="w-4 h-4" />,
    },
  ];

  return (
    <div className="p-8 overflow-y-auto h-full space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your account preferences and application settings
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
            saved
              ? "bg-emerald-500 text-white"
              : "bg-[#3f5ecc] hover:bg-[#3552b8] text-white shadow-md shadow-[#3f5ecc]/20"
          }`}
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" /> Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Changes
            </>
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-56 flex-shrink-0">
          <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm overflow-hidden">
            <nav className="p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-[#eef2ff] text-[#3f5ecc]"
                      : "text-slate-600 hover:bg-[#f5f7ff] hover:text-slate-800"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === "general" && <GeneralSettings />}
          {activeTab === "notifications" && <NotificationSettings />}
          {activeTab === "team" && <TeamSettings />}
          {activeTab === "integrations" && <IntegrationSettings />}
          {activeTab === "ai" && <AISettings />}
          {activeTab === "security" && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
};

const GeneralSettings: React.FC = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Globe className="w-5 h-5 text-[#3f5ecc]" /> Organization Settings
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Organization Name
          </label>
          <input
            type="text"
            defaultValue="Acme Corp"
            className="w-full px-3 py-2.5 bg-[#f5f7ff] border border-[#BDDEF3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3f5ecc] transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Industry
          </label>
          <select className="w-full px-3 py-2.5 bg-[#f5f7ff] border border-[#BDDEF3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3f5ecc]">
            <option>Technology</option>
            <option>Finance</option>
            <option>Healthcare</option>
            <option>Education</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Company Size
          </label>
          <select className="w-full px-3 py-2.5 bg-[#f5f7ff] border border-[#BDDEF3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3f5ecc]">
            <option>1-10 employees</option>
            <option>11-50 employees</option>
            <option>51-200 employees</option>
            <option>201-500 employees</option>
            <option>500+ employees</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Time Zone
          </label>
          <select className="w-full px-3 py-2.5 bg-[#f5f7ff] border border-[#BDDEF3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3f5ecc]">
            <option>Pacific Time (PT)</option>
            <option>Mountain Time (MT)</option>
            <option>Central Time (CT)</option>
            <option>Eastern Time (ET)</option>
          </select>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Palette className="w-5 h-5 text-[#E9C7DB]" /> Appearance
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Language
          </label>
          <select className="w-full px-3 py-2.5 bg-[#f5f7ff] border border-[#BDDEF3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3f5ecc]">
            <option>English (US)</option>
            <option>Spanish</option>
            <option>French</option>
            <option>German</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Date Format
          </label>
          <select className="w-full px-3 py-2.5 bg-[#f5f7ff] border border-[#BDDEF3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3f5ecc]">
            <option>MM/DD/YYYY</option>
            <option>DD/MM/YYYY</option>
            <option>YYYY-MM-DD</option>
          </select>
        </div>
      </div>
    </div>
  </div>
);

const NotificationSettings: React.FC = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Mail className="w-5 h-5 text-[#3f5ecc]" /> Email Notifications
      </h3>
      <div className="space-y-4">
        <NotificationToggle
          label="New candidate applications"
          description="Get notified when new resumes are uploaded"
          defaultChecked={true}
        />
        <NotificationToggle
          label="Candidate shortlisted"
          description="When AI recommends a candidate for review"
          defaultChecked={true}
        />
        <NotificationToggle
          label="Daily summary"
          description="Receive a daily digest of applicant activity"
          defaultChecked={true}
        />
        <NotificationToggle
          label="Weekly reports"
          description="Get weekly recruitment analytics"
          defaultChecked={false}
        />
      </div>
    </div>

    <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Bell className="w-5 h-5 text-[#E9C7DB]" /> In-App Notifications
      </h3>
      <div className="space-y-4">
        <NotificationToggle
          label="Interview reminders"
          description="Push notifications 30 min before interviews"
          defaultChecked={true}
        />
        <NotificationToggle
          label="AI processing complete"
          description="When resume analysis is finished"
          defaultChecked={true}
        />
        <NotificationToggle
          label="Team mentions"
          description="When a team member mentions you"
          defaultChecked={true}
        />
      </div>
    </div>
  </div>
);

const NotificationToggle: React.FC<{
  label: string;
  description: string;
  defaultChecked: boolean;
}> = ({ label, description, defaultChecked }) => {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f5f7ff] transition-colors">
      <div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-[#3f5ecc]" : "bg-slate-200"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

const TeamSettings: React.FC = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Users className="w-5 h-5 text-[#3f5ecc]" /> Team Members
        </h3>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-[#eef2ff] text-[#3f5ecc] rounded-lg text-sm font-medium hover:bg-[#BDDEF3] transition-colors">
          + Invite Member
        </button>
      </div>
      <div className="space-y-3">
        <TeamMember
          name="John Doe"
          email="john@acme.com"
          role="Admin"
          initials="JD"
          color="bg-[#3f5ecc]"
          isYou={true}
        />
        <TeamMember
          name="Jane Smith"
          email="jane@acme.com"
          role="Recruiter"
          initials="JS"
          color="bg-[#E9C7DB]"
        />
        <TeamMember
          name="Mike Johnson"
          email="mike@acme.com"
          role="Hiring Manager"
          initials="MJ"
          color="bg-[#BDDEF3]"
        />
      </div>
    </div>

    <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-slate-500" /> Role Permissions
      </h3>
      <div className="space-y-3">
        <RolePermission
          role="Admin"
          description="Full access to all features and settings"
        />
        <RolePermission
          role="Recruiter"
          description="Can view candidates, upload resumes, and manage job postings"
        />
        <RolePermission
          role="Hiring Manager"
          description="Can view shortlisted candidates and provide feedback"
        />
        <RolePermission
          role="Viewer"
          description="Read-only access to candidate profiles"
        />
      </div>
    </div>
  </div>
);

const TeamMember: React.FC<{
  name: string;
  email: string;
  role: string;
  initials: string;
  color: string;
  isYou?: boolean;
}> = ({ name, email, role, initials, color, isYou }) => (
  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f5f7ff] transition-colors">
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-full ${color} text-white flex items-center justify-center text-sm font-bold`}
      >
        {initials}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-800">
          {name} {isYou && <span className="text-slate-400">(You)</span>}
        </p>
        <p className="text-xs text-slate-500">{email}</p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium text-slate-600 bg-[#f5f7ff] px-2 py-1 rounded">
        {role}
      </span>
      {!isYou && (
        <button className="text-xs text-slate-400 hover:text-red-500 transition-colors">
          Remove
        </button>
      )}
    </div>
  </div>
);

const RolePermission: React.FC<{ role: string; description: string }> = ({
  role,
  description,
}) => (
  <div className="flex items-center justify-between p-3 border border-[#BDDEF3] rounded-lg">
    <div>
      <p className="text-sm font-medium text-slate-800">{role}</p>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
    <ChevronRight className="w-4 h-4 text-slate-400" />
  </div>
);

const IntegrationSettings: React.FC = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Database className="w-5 h-5 text-[#3f5ecc]" /> Connected Services
      </h3>
      <div className="space-y-4">
        <IntegrationCard
          name="LinkedIn Recruiter"
          description="Connected as admin@acme.com"
          logo="in"
          logoColor="bg-[#0077b5]"
          connected={true}
        />
        <IntegrationCard
          name="GitHub API"
          description="Verify candidate contributions"
          logo="GH"
          logoColor="bg-slate-900"
          connected={false}
        />
        <IntegrationCard
          name="Google Calendar"
          description="Sync interview schedules"
          logo="G"
          logoColor="bg-red-500"
          connected={true}
        />
        <IntegrationCard
          name="Slack"
          description="Team notifications"
          logo="S"
          logoColor="bg-purple-600"
          connected={false}
        />
      </div>
    </div>

    <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Key className="w-5 h-5 text-[#E9C7DB]" /> API Keys
      </h3>
      <div className="space-y-4">
        <div className="p-4 bg-[#f5f7ff] rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-800">Gemini API Key</p>
            <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">
              Active
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono">
            ••••••••••••••••••••••••8h4k
          </p>
        </div>
        <button className="text-sm text-[#3f5ecc] font-medium hover:underline">
          + Add new API key
        </button>
      </div>
    </div>
  </div>
);

const IntegrationCard: React.FC<{
  name: string;
  description: string;
  logo: string;
  logoColor: string;
  connected: boolean;
}> = ({ name, description, logo, logoColor, connected }) => (
  <div className="flex items-center justify-between p-4 border border-[#BDDEF3] rounded-lg hover:bg-[#f5f7ff] transition-colors">
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 ${logoColor} rounded-lg text-white flex items-center justify-center font-bold text-sm`}
      >
        {logo}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-800">{name}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </div>
    {connected ? (
      <button className="text-xs text-red-500 font-medium hover:underline">
        Disconnect
      </button>
    ) : (
      <button className="text-xs text-[#3f5ecc] font-medium hover:underline">
        Connect
      </button>
    )}
  </div>
);

const AISettings: React.FC = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Brain className="w-5 h-5 text-[#3f5ecc]" /> AI Screening Settings
      </h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Minimum Score Threshold
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="70"
              className="flex-1 h-2 bg-[#eef2ff] rounded-lg appearance-none cursor-pointer accent-[#3f5ecc]"
            />
            <span className="text-sm font-medium text-slate-800 w-12 text-center bg-[#f5f7ff] py-1 rounded">
              70
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Candidates below this score will be auto-rejected
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Confirmation Threshold (Top %)
            </label>
            <select className="w-full px-3 py-2.5 bg-[#f5f7ff] border border-[#BDDEF3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3f5ecc]">
              <option value="10">Top 10%</option>
              <option value="20" selected>
                Top 20%
              </option>
              <option value="30">Top 30%</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Rejection Threshold (Bottom %)
            </label>
            <select className="w-full px-3 py-2.5 bg-[#f5f7ff] border border-[#BDDEF3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3f5ecc]">
              <option value="10">Bottom 10%</option>
              <option value="20" selected>
                Bottom 20%
              </option>
              <option value="30">Bottom 30%</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-[#E9C7DB]" /> Processing Options
      </h3>
      <div className="space-y-4">
        <NotificationToggle
          label="Auto-generate interview questions"
          description="AI creates tailored questions for each candidate"
          defaultChecked={true}
        />
        <NotificationToggle
          label="Web verification"
          description="Check LinkedIn, GitHub for profile verification"
          defaultChecked={true}
        />
        <NotificationToggle
          label="Salary benchmarking"
          description="Auto-fetch market salary data"
          defaultChecked={true}
        />
        <NotificationToggle
          label="Auto-draft emails"
          description="Generate acceptance/rejection email drafts"
          defaultChecked={false}
        />
      </div>
    </div>
  </div>
);

const SecuritySettings: React.FC = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-[#3f5ecc]" /> Account Security
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-[#BDDEF3] rounded-lg">
          <div>
            <p className="text-sm font-medium text-slate-800">Password</p>
            <p className="text-xs text-slate-500">Last changed 30 days ago</p>
          </div>
          <button className="text-sm text-[#3f5ecc] font-medium hover:underline">
            Change
          </button>
        </div>
        <div className="flex items-center justify-between p-4 border border-[#BDDEF3] rounded-lg">
          <div>
            <p className="text-sm font-medium text-slate-800">
              Two-Factor Authentication
            </p>
            <p className="text-xs text-slate-500">
              Add an extra layer of security
            </p>
          </div>
          <button className="text-sm text-[#3f5ecc] font-medium hover:underline">
            Enable
          </button>
        </div>
        <div className="flex items-center justify-between p-4 border border-[#BDDEF3] rounded-lg">
          <div>
            <p className="text-sm font-medium text-slate-800">
              Active Sessions
            </p>
            <p className="text-xs text-slate-500">2 devices logged in</p>
          </div>
          <button className="text-sm text-[#3f5ecc] font-medium hover:underline">
            Manage
          </button>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Database className="w-5 h-5 text-[#E9C7DB]" /> Data & Privacy
      </h3>
      <div className="space-y-4">
        <NotificationToggle
          label="Data retention"
          description="Keep candidate data for 2 years"
          defaultChecked={true}
        />
        <NotificationToggle
          label="Analytics tracking"
          description="Allow usage analytics to improve the product"
          defaultChecked={true}
        />
        <div className="pt-4 border-t border-[#BDDEF3]">
          <button className="text-sm text-red-500 font-medium hover:underline">
            Delete all data
          </button>
          <p className="text-xs text-slate-500 mt-1">
            This will permanently remove all candidates and job postings
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default SettingsPage;
