import React, { useState } from "react";
import {
  Mail,
  MapPin,
  Award,
  Clock,
  Briefcase,
  User,
  Shield,
  Bell,
  Calendar,
  Edit3,
  Camera,
  Check,
  Save,
  TrendingUp,
  Target,
  Users,
  FileText,
  Star,
} from "lucide-react";

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [saved, setSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setIsEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: <User className="w-4 h-4" /> },
    {
      id: "activity",
      label: "Activity",
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      id: "preferences",
      label: "Preferences",
      icon: <Bell className="w-4 h-4" />,
    },
    { id: "security", label: "Security", icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <div className="p-8 overflow-y-auto h-full space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-slate-500 mb-1">Account</p>
          <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
          <p className="text-slate-500 text-sm mt-1">
            View and manage your personal information
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

      {/* Profile Header Card */}
      <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-[#3f5ecc] to-[#3552b8]"></div>
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-4 -mt-12">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-[#3f5ecc] text-white flex items-center justify-center text-3xl font-bold shadow-lg border-4 border-white">
                JD
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center border border-[#BDDEF3] hover:bg-[#f5f7ff] transition-colors">
                <Camera className="w-4 h-4 text-slate-600" />
              </button>
            </div>
            <div className="flex-1 text-center md:text-left pt-2">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h2 className="text-xl font-bold text-slate-800">John Doe</h2>
                <span className="px-2 py-0.5 bg-[#eef2ff] text-[#3f5ecc] text-xs font-medium rounded">
                  Admin
                </span>
              </div>
              <p className="text-slate-500 text-sm">
                Senior Technical Recruiter
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2 text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-[#3f5ecc]" /> San Francisco,
                  CA
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4 text-[#3f5ecc]" /> john.doe@acme.com
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-[#3f5ecc]" /> Joined Mar
                  2023
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 border border-[#BDDEF3] rounded-lg text-sm font-medium text-slate-600 hover:bg-[#f5f7ff] transition-colors"
            >
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Horizontal Tabs */}
        <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm overflow-hidden">
          <nav className="flex items-center gap-1 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
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

        {/* Content Area */}
        <div>
          {activeTab === "overview" && <OverviewTab isEditing={isEditing} />}
          {activeTab === "activity" && <ActivityTab />}
          {activeTab === "preferences" && <PreferencesTab />}
          {activeTab === "security" && <SecurityTab />}
        </div>
      </div>
    </div>
  );
};

const OverviewTab: React.FC<{ isEditing: boolean }> = ({ isEditing }) => (
  <div className="space-y-6">
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard
        icon={<Award className="w-5 h-5 text-[#3f5ecc]" />}
        value="142"
        label="Candidates Hired"
        color="bg-[#eef2ff]"
      />
      <StatCard
        icon={<Clock className="w-5 h-5 text-[#E9C7DB]" />}
        value="12 Days"
        label="Avg. Time to Hire"
        color="bg-[#E9C7DB]/30"
      />
      <StatCard
        icon={<Briefcase className="w-5 h-5 text-[#3f5ecc]" />}
        value="8"
        label="Active Roles"
        color="bg-[#eef2ff]"
      />
      <StatCard
        icon={<Star className="w-5 h-5 text-amber-500" />}
        value="4.9"
        label="Avg. Rating"
        color="bg-amber-100"
      />
    </div>

    {/* Personal Information */}
    <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-[#3f5ecc]" /> Personal Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Full Name" value="John Doe" isEditing={isEditing} />
        <InputField
          label="Job Title"
          value="Senior Technical Recruiter"
          isEditing={isEditing}
        />
        <InputField
          label="Email Address"
          value="john.doe@acme.com"
          isEditing={isEditing}
        />
        <InputField
          label="Phone Number"
          value="+1 (555) 000-0000"
          isEditing={isEditing}
        />
        <InputField
          label="Location"
          value="San Francisco, CA"
          isEditing={isEditing}
        />
        <InputField
          label="Department"
          value="Engineering Recruitment"
          isEditing={isEditing}
        />
      </div>
    </div>

    {/* Bio */}
    <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-[#E9C7DB]" /> About
      </h3>
      {isEditing ? (
        <textarea
          defaultValue="Experienced technical recruiter with 8+ years specializing in engineering and product roles. Passionate about connecting top talent with innovative companies and building diverse, high-performing teams."
          className="w-full px-3 py-2.5 bg-[#f5f7ff] border border-[#BDDEF3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3f5ecc] transition-all min-h-[100px]"
        />
      ) : (
        <p className="text-sm text-slate-600 leading-relaxed">
          Experienced technical recruiter with 8+ years specializing in
          engineering and product roles. Passionate about connecting top talent
          with innovative companies and building diverse, high-performing teams.
        </p>
      )}
    </div>

    {/* Skills */}
    <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-[#3f5ecc]" /> Specializations
      </h3>
      <div className="flex flex-wrap gap-2">
        {[
          "Software Engineering",
          "Product Management",
          "Data Science",
          "DevOps",
          "Machine Learning",
          "Frontend Development",
          "Backend Development",
          "Technical Leadership",
        ].map((skill) => (
          <span
            key={skill}
            className="px-3 py-1.5 bg-[#eef2ff] text-[#3f5ecc] text-sm font-medium rounded-lg"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const StatCard: React.FC<{
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}> = ({ icon, value, label, color }) => (
  <div className="bg-white p-4 rounded-xl border border-[#BDDEF3] shadow-sm">
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}
      >
        {icon}
      </div>
      <div>
        <p className="text-lg font-bold text-slate-800">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  </div>
);

const InputField: React.FC<{
  label: string;
  value: string;
  isEditing: boolean;
}> = ({ label, value, isEditing }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
      {label}
    </label>
    {isEditing ? (
      <input
        type="text"
        defaultValue={value}
        className="w-full px-3 py-2.5 bg-[#f5f7ff] border border-[#BDDEF3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3f5ecc] transition-all"
      />
    ) : (
      <p className="text-sm text-slate-800 p-2.5 bg-[#f5f7ff] rounded-lg border border-[#BDDEF3]">
        {value}
      </p>
    )}
  </div>
);

const ActivityTab: React.FC = () => (
  <div className="space-y-6">
    {/* Recent Activity */}
    <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-[#3f5ecc]" /> Recent Activity
      </h3>
      <div className="space-y-4">
        <ActivityItem
          action="Reviewed candidate"
          detail="Sarah Chen for Senior Backend Engineer"
          time="2 hours ago"
          icon={<Users className="w-4 h-4" />}
        />
        <ActivityItem
          action="Uploaded resumes"
          detail="5 resumes for Product Manager role"
          time="Yesterday"
          icon={<FileText className="w-4 h-4" />}
        />
        <ActivityItem
          action="Scheduled interview"
          detail="Mike Johnson - Technical Screening"
          time="2 days ago"
          icon={<Calendar className="w-4 h-4" />}
        />
        <ActivityItem
          action="Hired candidate"
          detail="Emily Davis as Frontend Developer"
          time="1 week ago"
          icon={<Check className="w-4 h-4" />}
        />
        <ActivityItem
          action="Created job posting"
          detail="DevOps Engineer - Full-time"
          time="1 week ago"
          icon={<Briefcase className="w-4 h-4" />}
        />
      </div>
    </div>

    {/* Performance */}
    <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-[#E9C7DB]" /> This Month's Performance
      </h3>
      <div className="space-y-4">
        <ProgressItem label="Hiring Goal" current={8} total={10} />
        <ProgressItem label="Candidates Screened" current={47} total={50} />
        <ProgressItem label="Interviews Scheduled" current={12} total={15} />
      </div>
    </div>
  </div>
);

const ActivityItem: React.FC<{
  action: string;
  detail: string;
  time: string;
  icon: React.ReactNode;
}> = ({ action, detail, time, icon }) => (
  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#f5f7ff] transition-colors">
    <div className="w-8 h-8 rounded-full bg-[#eef2ff] flex items-center justify-center text-[#3f5ecc]">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium text-slate-800">{action}</p>
      <p className="text-xs text-slate-500">{detail}</p>
    </div>
    <span className="text-xs text-slate-400">{time}</span>
  </div>
);

const ProgressItem: React.FC<{
  label: string;
  current: number;
  total: number;
}> = ({ label, current, total }) => {
  const percentage = (current / total) * 100;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-500">
          {current}/{total}
        </span>
      </div>
      <div className="h-2 bg-[#eef2ff] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#3f5ecc] rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const PreferencesTab: React.FC = () => {
  const [emailDigest, setEmailDigest] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#3f5ecc]" /> Notification Preferences
        </h3>
        <div className="space-y-4">
          <ToggleItem
            label="Email Digest"
            description="Receive daily summary of candidate activity"
            checked={emailDigest}
            onChange={() => setEmailDigest(!emailDigest)}
          />
          <ToggleItem
            label="Push Notifications"
            description="Get notified about interviews and updates"
            checked={pushNotifications}
            onChange={() => setPushNotifications(!pushNotifications)}
          />
          <ToggleItem
            label="Weekly Report"
            description="Receive weekly recruitment analytics"
            checked={weeklyReport}
            onChange={() => setWeeklyReport(!weeklyReport)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#E9C7DB]" /> Calendar Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Default Meeting Duration
            </label>
            <select className="w-full px-3 py-2.5 bg-[#f5f7ff] border border-[#BDDEF3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3f5ecc]">
              <option>30 minutes</option>
              <option>45 minutes</option>
              <option>60 minutes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Working Hours
            </label>
            <select className="w-full px-3 py-2.5 bg-[#f5f7ff] border border-[#BDDEF3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3f5ecc]">
              <option>9:00 AM - 5:00 PM</option>
              <option>8:00 AM - 4:00 PM</option>
              <option>10:00 AM - 6:00 PM</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToggleItem: React.FC<{
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}> = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f5f7ff] transition-colors">
    <div>
      <p className="text-sm font-medium text-slate-800">{label}</p>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
    <button
      onClick={onChange}
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

const SecurityTab: React.FC = () => (
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
        <Clock className="w-5 h-5 text-[#E9C7DB]" /> Login History
      </h3>
      <div className="space-y-3">
        <LoginHistoryItem
          device="MacBook Pro - Chrome"
          location="San Francisco, CA"
          time="Current session"
          current={true}
        />
        <LoginHistoryItem
          device="iPhone 15 - Safari"
          location="San Francisco, CA"
          time="2 hours ago"
        />
        <LoginHistoryItem
          device="Windows PC - Firefox"
          location="San Francisco, CA"
          time="Yesterday"
        />
      </div>
    </div>

    <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 text-red-600">
        Danger Zone
      </h3>
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <p className="text-sm font-medium text-red-800">Delete Account</p>
        <p className="text-xs text-red-600 mt-1">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
        <button className="mt-3 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  </div>
);

const LoginHistoryItem: React.FC<{
  device: string;
  location: string;
  time: string;
  current?: boolean;
}> = ({ device, location, time, current }) => (
  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f5f7ff] transition-colors">
    <div>
      <p className="text-sm font-medium text-slate-800">
        {device}
        {current && (
          <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded">
            Current
          </span>
        )}
      </p>
      <p className="text-xs text-slate-500">{location}</p>
    </div>
    <span className="text-xs text-slate-400">{time}</span>
  </div>
);

export default ProfilePage;
