import React, { useState } from "react";
import {
  Mail,
  MapPin,
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
      id: "preferences",
      label: "Preferences",
      icon: <Bell className="w-4 h-4" />,
    },
    { id: "security", label: "Security", icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage your account settings
            </p>
          </div>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              saved
                ? "bg-emerald-500 text-white"
                : "bg-[#3f5ecc] hover:bg-[#3552b8] text-white"
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

        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Banner */}
          <div className="h-24 bg-[#3f5ecc]"></div>

          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-[#3f5ecc] text-white flex items-center justify-center text-2xl font-bold border-4 border-white">
                  JD
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200 hover:bg-slate-50 transition-colors">
                  <Camera className="w-4 h-4 text-slate-600" />
                </button>
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left pt-2">
                <h2 className="text-xl font-bold text-slate-800">John Doe</h2>
                <p className="text-slate-500 text-sm">
                  Senior Technical Recruiter
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-[#3f5ecc]" /> San Francisco,
                    CA
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4 text-[#3f5ecc]" />{" "}
                    john.doe@acme.com
                  </span>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isEditing
                    ? "bg-slate-100 text-slate-600"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Edit3 className="w-4 h-4" />
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="flex border-b border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? "border-[#3f5ecc] text-[#3f5ecc]"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "overview" && <OverviewTab isEditing={isEditing} />}
            {activeTab === "preferences" && <PreferencesTab />}
            {activeTab === "security" && <SecurityTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Overview Tab
const OverviewTab: React.FC<{ isEditing: boolean }> = ({ isEditing }) => (
  <div className="space-y-6">
    {/* Personal Information */}
    <div>
      <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-[#3f5ecc]" /> Personal Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Full Name" value="John Doe" isEditing={isEditing} />
        <InputField
          label="Job Title"
          value="Senior Technical Recruiter"
          isEditing={isEditing}
        />
        <InputField
          label="Email"
          value="john.doe@acme.com"
          isEditing={isEditing}
        />
        <InputField
          label="Phone"
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

    {/* About */}
    <div>
      <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-[#3f5ecc]" /> About
      </h3>
      {isEditing ? (
        <textarea
          defaultValue="Experienced technical recruiter with 8+ years specializing in engineering and product roles."
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3f5ecc] focus:border-transparent min-h-[100px] resize-none"
        />
      ) : (
        <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-lg">
          Experienced technical recruiter with 8+ years specializing in
          engineering and product roles.
        </p>
      )}
    </div>
  </div>
);

// Preferences Tab
const PreferencesTab: React.FC = () => {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#3f5ecc]" /> Notifications
        </h3>
        <div className="space-y-3">
          <ToggleItem
            label="Email Notifications"
            description="Receive updates via email"
            checked={emailNotifs}
            onChange={() => setEmailNotifs(!emailNotifs)}
          />
          <ToggleItem
            label="Push Notifications"
            description="Receive in-app notifications"
            checked={pushNotifs}
            onChange={() => setPushNotifs(!pushNotifs)}
          />
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#3f5ecc]" /> Calendar
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Default Meeting Duration
            </label>
            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3f5ecc]">
              <option>30 minutes</option>
              <option>45 minutes</option>
              <option>60 minutes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Working Hours
            </label>
            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3f5ecc]">
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

// Security Tab
const SecurityTab: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-[#3f5ecc]" /> Security Settings
      </h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
          <div>
            <p className="text-sm font-medium text-slate-800">Password</p>
            <p className="text-xs text-slate-500">Last changed 30 days ago</p>
          </div>
          <button className="text-sm text-[#3f5ecc] font-medium hover:underline">
            Change
          </button>
        </div>
        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
          <div>
            <p className="text-sm font-medium text-slate-800">
              Two-Factor Authentication
            </p>
            <p className="text-xs text-slate-500">
              Add extra security to your account
            </p>
          </div>
          <button className="text-sm text-[#3f5ecc] font-medium hover:underline">
            Enable
          </button>
        </div>
      </div>
    </div>

    <div>
      <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-[#3f5ecc]" /> Login History
      </h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-slate-800">
              MacBook Pro - Chrome
              <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded">
                Current
              </span>
            </p>
            <p className="text-xs text-slate-500">San Francisco, CA</p>
          </div>
          <span className="text-xs text-slate-400">Now</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-slate-800">
              iPhone - Safari
            </p>
            <p className="text-xs text-slate-500">San Francisco, CA</p>
          </div>
          <span className="text-xs text-slate-400">2 hours ago</span>
        </div>
      </div>
    </div>
  </div>
);

// Input Field Component
const InputField: React.FC<{
  label: string;
  value: string;
  isEditing: boolean;
}> = ({ label, value, isEditing }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">
      {label}
    </label>
    {isEditing ? (
      <input
        type="text"
        defaultValue={value}
        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3f5ecc] focus:border-transparent"
      />
    ) : (
      <p className="text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
        {value}
      </p>
    )}
  </div>
);

// Toggle Component
const ToggleItem: React.FC<{
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}> = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
    <div>
      <p className="text-sm font-medium text-slate-800">{label}</p>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
    <button
      onClick={onChange}
      className={`relative w-10 h-6 rounded-full transition-colors ${
        checked ? "bg-[#3f5ecc]" : "bg-slate-200"
      }`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
          checked ? "translate-x-4" : ""
        }`}
      />
    </button>
  </div>
);

export default ProfilePage;
