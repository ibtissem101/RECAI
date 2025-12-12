import React, { useState } from "react";
import {
  Eye,
  Edit3,
  CheckCircle2,
  XCircle,
  Flag,
  MessageSquare,
  DollarSign,
  Globe,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Shield,
  ThumbsUp,
  ThumbsDown,
  Send,
  Save,
  RefreshCw,
  Star,
  Users,
  Brain,
  FileText,
  Mail,
  Sparkles,
  TrendingUp,
  Clock,
  Check,
  X,
  Link2,
  Briefcase,
} from "lucide-react";
import {
  Candidate,
  WebSource,
  InterviewQuestion,
  CommunicationDraft,
} from "../types";

interface HRReviewDashboardProps {
  candidate: Candidate;
  onUpdateCandidate: (updated: Candidate) => void;
  onBack: () => void;
}

const HRReviewDashboard: React.FC<HRReviewDashboardProps> = ({
  candidate,
  onUpdateCandidate,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "sources" | "questions" | "communications" | "salary"
  >("overview");
  const [showScoreOverride, setShowScoreOverride] = useState(false);
  const [overrideScore, setOverrideScore] = useState(
    candidate.hrOverrideScore || candidate.score
  );
  const [overrideReason, setOverrideReason] = useState(
    candidate.hrOverrideReason || ""
  );
  const [flagReason, setFlagReason] = useState(candidate.flagReason || "");
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null
  );
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);

  // Mock AI Reasoning data
  const aiReasoning = candidate.aiReasoning || {
    summary: `${candidate.name} demonstrates strong alignment with the ${
      candidate.role
    } position. Their background at ${
      candidate.previousCompanies[0]?.name || "previous companies"
    } shows relevant experience in our tech stack.`,
    strengths: [
      `${candidate.experienceYears} years of relevant industry experience`,
      `Strong proficiency in ${candidate.skills.slice(0, 2).join(" and ")}`,
      `Verified contributions on GitHub (${
        candidate.webVerification.github?.contributions || 0
      } commits)`,
      `Previous scaling experience at ${
        candidate.previousCompanies[0]?.name || "growth-stage company"
      }`,
    ],
    concerns: [
      ...candidate.missingSkills.map(
        (s) => `Limited evidence of ${s} experience`
      ),
      "Salary expectations may be at the higher end of budget",
    ],
    recommendation:
      candidate.score >= 85
        ? "Strong Hire"
        : candidate.score >= 70
        ? "Hire"
        : candidate.score >= 50
        ? "Maybe"
        : "No Hire",
    confidenceScore: Math.min(95, candidate.score + 5),
    webSources: [
      {
        type: "github" as const,
        url: `https://github.com/${
          candidate.webVerification.github?.handle || "user"
        }`,
        title: `${candidate.name}'s GitHub Profile`,
        snippet: `${
          candidate.webVerification.github?.contributions || 0
        } contributions in the last year. Top languages: ${
          candidate.webVerification.github?.topLanguages?.join(", ") ||
          "Various"
        }`,
        relevance: "high" as const,
        verifiedAt: new Date().toISOString(),
      },
      {
        type: "linkedin" as const,
        url: "https://linkedin.com/in/profile",
        title: `${candidate.name} - LinkedIn`,
        snippet: `${candidate.role} with ${
          candidate.experienceYears
        } years experience. Previous: ${
          candidate.previousCompanies[0]?.name || "Multiple companies"
        }`,
        relevance: "high" as const,
        verifiedAt: new Date().toISOString(),
      },
      {
        type: "portfolio" as const,
        url: "https://portfolio.example.com",
        title: "Personal Portfolio",
        snippet: `Showcases projects using ${candidate.skills[0]} and ${candidate.skills[1]}. Clean code architecture demonstrated.`,
        relevance: "medium" as const,
        verifiedAt: new Date().toISOString(),
      },
    ],
  };

  // Mock interview questions
  const [interviewQuestions, setInterviewQuestions] = useState<
    InterviewQuestion[]
  >(
    candidate.interviewQuestions || [
      {
        id: "1",
        topic: "Technical - System Design",
        question: `Describe how you would design a scalable ${
          candidate.skills[0] || "backend"
        } service handling 10,000 requests per second.`,
        lookingFor:
          "Understanding of load balancing, caching strategies, database sharding, and microservices architecture.",
        edited: false,
      },
      {
        id: "2",
        topic: `Experience at ${
          candidate.previousCompanies[0]?.name || "Previous Company"
        }`,
        question: `Tell me about your biggest technical challenge during ${
          candidate.previousCompanies[0]?.context || "your previous role"
        } and how you overcame it.`,
        lookingFor:
          "Problem-solving approach, technical depth, collaboration skills.",
        edited: false,
      },
      {
        id: "3",
        topic:
          "Skill Gap - " + (candidate.missingSkills[0] || "New Technology"),
        question: `You mentioned limited experience with ${
          candidate.missingSkills[0] || "certain technologies"
        }. How do you approach learning new technologies quickly?`,
        lookingFor:
          "Learning agility, self-motivation, practical examples of quick skill acquisition.",
        edited: false,
      },
      {
        id: "4",
        topic: "Culture Fit",
        question:
          "Describe a time when you disagreed with a technical decision made by your team. How did you handle it?",
        lookingFor:
          "Communication style, ability to influence without authority, respect for team decisions.",
        edited: false,
      },
    ]
  );

  // Mock communication drafts
  const [communicationDrafts, setCommunicationDrafts] = useState<
    CommunicationDraft[]
  >(
    candidate.communicationDrafts || [
      {
        id: "1",
        type: "interview_invite",
        subject: `Interview Invitation - ${candidate.role} Position at RecAI`,
        body: `Dear ${
          candidate.name
        },\n\nThank you for your application for the ${
          candidate.role
        } position. After reviewing your impressive background, particularly your experience at ${
          candidate.previousCompanies[0]?.name || "your previous companies"
        } and your expertise in ${candidate.skills
          .slice(0, 2)
          .join(
            " and "
          )}, we would like to invite you for an interview.\n\nWe were particularly impressed by your ${
          candidate.webVerification.github?.notableProject ||
          "technical contributions"
        } and believe your skills align well with our team's needs.\n\nPlease let us know your availability for the coming week.\n\nBest regards,\nThe RecAI Hiring Team`,
        status: "draft",
      },
      {
        id: "2",
        type: "rejection",
        subject: `Update on Your Application - ${candidate.role} at RecAI`,
        body: `Dear ${candidate.name},\n\nThank you for taking the time to apply for the ${candidate.role} position at RecAI. After careful consideration, we have decided to move forward with other candidates whose experience more closely matches our current needs.\n\nWe were impressed by your ${candidate.skills[0]} skills and encourage you to apply for future positions that match your expertise.\n\nWe wish you the best in your job search.\n\nBest regards,\nThe RecAI Hiring Team`,
        status: "draft",
      },
    ]
  );

  // Salary recommendation
  const salaryRec = candidate.salaryRecommendation || {
    min: candidate.webVerification.salaryBenchmark.min,
    max: candidate.webVerification.salaryBenchmark.max,
    recommended: Math.round(
      (candidate.webVerification.salaryBenchmark.min +
        candidate.webVerification.salaryBenchmark.max) /
        2
    ),
    marketData: {
      percentile25: candidate.webVerification.salaryBenchmark.min - 10000,
      percentile50: Math.round(
        (candidate.webVerification.salaryBenchmark.min +
          candidate.webVerification.salaryBenchmark.max) /
          2
      ),
      percentile75: candidate.webVerification.salaryBenchmark.max + 10000,
      source: "Levels.fyi, Glassdoor, LinkedIn Salary Insights",
    },
  };

  const [adjustedSalary, setAdjustedSalary] = useState(
    salaryRec.hrAdjusted || salaryRec.recommended
  );
  const [salaryAdjustmentReason, setSalaryAdjustmentReason] = useState(
    salaryRec.adjustmentReason || ""
  );

  const handleScoreOverride = () => {
    const updated = {
      ...candidate,
      hrOverrideScore: overrideScore,
      hrOverrideReason: overrideReason,
    };
    onUpdateCandidate(updated);
    setShowScoreOverride(false);
  };

  const handleFlagCandidate = () => {
    const updated = {
      ...candidate,
      flaggedForReview: true,
      flagReason: flagReason,
    };
    onUpdateCandidate(updated);
    setShowFlagModal(false);
  };

  const handleUnflagCandidate = () => {
    const updated = {
      ...candidate,
      flaggedForReview: false,
      flagReason: undefined,
    };
    onUpdateCandidate(updated);
  };

  const handleQuestionEdit = (
    id: string,
    newQuestion: string,
    newLookingFor: string
  ) => {
    setInterviewQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              question: newQuestion,
              lookingFor: newLookingFor,
              edited: true,
              editedBy: "HR Manager",
            }
          : q
      )
    );
    setEditingQuestionId(null);
  };

  const handleDraftApprove = (id: string) => {
    setCommunicationDrafts((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, status: "approved" as const, approvedBy: "HR Manager" }
          : d
      )
    );
  };

  const handleDraftReject = (id: string) => {
    setCommunicationDrafts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "rejected" as const } : d))
    );
  };

  const handleDraftEdit = (id: string, newBody: string) => {
    setCommunicationDrafts((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, editedBody: newBody, status: "draft" as const }
          : d
      )
    );
    setEditingDraftId(null);
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case "Strong Hire":
        return "bg-green-100 text-green-700 border-green-300";
      case "Hire":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "Maybe":
        return "bg-amber-100 text-amber-700 border-amber-300";
      case "No Hire":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case "github":
        return <Globe className="w-4 h-4" />;
      case "linkedin":
        return <Users className="w-4 h-4" />;
      case "portfolio":
        return <FileText className="w-4 h-4" />;
      default:
        return <Link2 className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F9FC] overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-[#BDDEF3] px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-slate-500 hover:text-[#3f5ecc]"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <Shield className="w-5 h-5 text-[#3f5ecc]" />
              HR Review Dashboard
              {candidate.flaggedForReview && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full flex items-center gap-1">
                  <Flag className="w-3 h-3" /> Flagged
                </span>
              )}
            </h1>
            <p className="text-sm text-slate-500">
              {candidate.name} • {candidate.role}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {candidate.flaggedForReview ? (
            <button
              onClick={handleUnflagCandidate}
              className="px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-100 flex items-center gap-2"
            >
              <X className="w-4 h-4" /> Remove Flag
            </button>
          ) : (
            <button
              onClick={() => setShowFlagModal(true)}
              className="px-4 py-2 bg-white border border-[#BDDEF3] text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2"
            >
              <Flag className="w-4 h-4" /> Flag for Review
            </button>
          )}
          <button
            onClick={() => setShowScoreOverride(true)}
            className="px-4 py-2 bg-[#3f5ecc] text-white rounded-lg text-sm font-medium hover:bg-[#3552b8] flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" /> Override Score
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-[#BDDEF3] px-6 flex gap-1">
        {[
          {
            id: "overview",
            label: "AI Reasoning",
            icon: <Brain className="w-4 h-4" />,
          },
          {
            id: "sources",
            label: "Web Sources",
            icon: <Globe className="w-4 h-4" />,
          },
          {
            id: "questions",
            label: "Interview Questions",
            icon: <MessageSquare className="w-4 h-4" />,
          },
          {
            id: "communications",
            label: "Communications",
            icon: <Mail className="w-4 h-4" />,
          },
          {
            id: "salary",
            label: "Salary Strategy",
            icon: <DollarSign className="w-4 h-4" />,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
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

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Score Summary Card - Always visible */}
          <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#3f5ecc]">
                    {candidate.hrOverrideScore || candidate.score}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {candidate.hrOverrideScore ? "HR Adjusted" : "AI Score"}
                  </div>
                </div>
                {candidate.hrOverrideScore && (
                  <div className="pl-6 border-l border-slate-200">
                    <div className="text-sm text-slate-500">
                      Original AI Score:{" "}
                      <span className="font-medium text-slate-700">
                        {candidate.score}
                      </span>
                    </div>
                    <div className="text-sm text-slate-500">
                      Reason:{" "}
                      <span className="font-medium text-slate-700">
                        {candidate.hrOverrideReason}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div
                className={`px-4 py-2 rounded-lg border font-medium ${getRecommendationColor(
                  aiReasoning.recommendation
                )}`}
              >
                {aiReasoning.recommendation}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* AI Reasoning Summary */}
              <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#3f5ecc]" />
                  AI Explainable Reasoning
                  <span className="ml-auto text-xs bg-[#eef2ff] text-[#3f5ecc] px-2 py-1 rounded-full">
                    {aiReasoning.confidenceScore}% Confidence
                  </span>
                </h3>

                <div className="bg-[#f5f7ff] p-4 rounded-lg border border-[#BDDEF3] mb-6">
                  <p className="text-slate-700">{aiReasoning.summary}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="border border-green-200 bg-green-50/50 rounded-lg p-4">
                    <h4 className="text-sm font-bold text-green-700 uppercase mb-3 flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4" /> Key Strengths
                    </h4>
                    <ul className="space-y-2">
                      {aiReasoning.strengths.map((strength, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-slate-700 flex items-start gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Concerns */}
                  <div className="border border-amber-200 bg-amber-50/50 rounded-lg p-4">
                    <h4 className="text-sm font-bold text-amber-700 uppercase mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Areas of Concern
                    </h4>
                    <ul className="space-y-2">
                      {aiReasoning.concerns.map((concern, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-slate-700 flex items-start gap-2"
                        >
                          <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          {concern}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Quick Decision Panel */}
              <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">
                  Quick Actions
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Approve & Move to
                    Interview
                  </button>
                  <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Add to Waitlist
                  </button>
                  <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> Reject Application
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "sources" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#3f5ecc]" />
                  Verified Web Sources
                  <span className="ml-auto text-xs text-slate-500">
                    {aiReasoning.webSources.length} sources consulted
                  </span>
                </h3>

                <div className="space-y-4">
                  {aiReasoning.webSources.map((source, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border ${
                        source.relevance === "high"
                          ? "border-green-200 bg-green-50/30"
                          : source.relevance === "medium"
                          ? "border-amber-200 bg-amber-50/30"
                          : "border-slate-200 bg-slate-50/30"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getSourceIcon(source.type)}
                          <span className="font-medium text-slate-800">
                            {source.title}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              source.relevance === "high"
                                ? "bg-green-100 text-green-700"
                                : source.relevance === "medium"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {source.relevance} relevance
                          </span>
                        </div>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#3f5ecc] hover:underline flex items-center gap-1 text-sm"
                        >
                          <ExternalLink className="w-3 h-3" /> View Source
                        </a>
                      </div>
                      <p className="text-sm text-slate-600">{source.snippet}</p>
                      <p className="text-xs text-slate-400 mt-2">
                        Verified:{" "}
                        {new Date(source.verifiedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>

                <button className="mt-4 w-full py-2 border border-dashed border-[#BDDEF3] rounded-lg text-slate-500 hover:text-[#3f5ecc] hover:border-[#3f5ecc] flex items-center justify-center gap-2 transition-colors">
                  <RefreshCw className="w-4 h-4" /> Refresh Web Research
                </button>
              </div>
            </div>
          )}

          {activeTab === "questions" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#3f5ecc]" />
                  AI-Generated Interview Questions
                  <span className="ml-auto text-xs text-slate-500">
                    Click to edit any question
                  </span>
                </h3>

                <div className="space-y-4">
                  {interviewQuestions.map((q) => (
                    <div
                      key={q.id}
                      className="p-4 rounded-lg border border-[#BDDEF3] bg-[#F8FAFC]"
                    >
                      {editingQuestionId === q.id ? (
                        <EditQuestionForm
                          question={q}
                          onSave={(newQ, newLF) =>
                            handleQuestionEdit(q.id, newQ, newLF)
                          }
                          onCancel={() => setEditingQuestionId(null)}
                        />
                      ) : (
                        <>
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-xs font-medium text-[#3f5ecc] bg-[#eef2ff] px-2 py-1 rounded">
                              {q.topic}
                            </span>
                            <div className="flex items-center gap-2">
                              {q.edited && (
                                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                                  Edited by {q.editedBy}
                                </span>
                              )}
                              <button
                                onClick={() => setEditingQuestionId(q.id)}
                                className="text-slate-400 hover:text-[#3f5ecc]"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-slate-800 font-medium mb-2">
                            "{q.question}"
                          </p>
                          <p className="text-xs text-slate-500">
                            <strong>Looking for:</strong> {q.lookingFor}
                          </p>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                <button className="mt-4 w-full py-2 border border-dashed border-[#BDDEF3] rounded-lg text-slate-500 hover:text-[#3f5ecc] hover:border-[#3f5ecc] flex items-center justify-center gap-2 transition-colors">
                  <Sparkles className="w-4 h-4" /> Generate More Questions
                </button>
              </div>
            </div>
          )}

          {activeTab === "communications" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#3f5ecc]" />
                  Communication Drafts
                  <span className="ml-auto text-xs text-slate-500">
                    Review and approve before sending
                  </span>
                </h3>

                <div className="space-y-6">
                  {communicationDrafts.map((draft) => (
                    <div
                      key={draft.id}
                      className={`p-4 rounded-lg border ${
                        draft.status === "approved"
                          ? "border-green-200 bg-green-50/30"
                          : draft.status === "rejected"
                          ? "border-red-200 bg-red-50/30"
                          : "border-[#BDDEF3] bg-[#F8FAFC]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded ${
                              draft.type === "interview_invite"
                                ? "bg-green-100 text-green-700"
                                : draft.type === "rejection"
                                ? "bg-red-100 text-red-700"
                                : draft.type === "offer"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {draft.type.replace("_", " ").toUpperCase()}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              draft.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : draft.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : draft.status === "sent"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {draft.status}
                          </span>
                        </div>
                        {draft.status === "draft" && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingDraftId(draft.id)}
                              className="text-slate-400 hover:text-[#3f5ecc] p-1"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDraftApprove(draft.id)}
                              className="text-green-500 hover:text-green-600 p-1"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDraftReject(draft.id)}
                              className="text-red-500 hover:text-red-600 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      <p className="text-sm font-medium text-slate-800 mb-2">
                        Subject: {draft.subject}
                      </p>

                      {editingDraftId === draft.id ? (
                        <EditDraftForm
                          draft={draft}
                          onSave={(newBody) =>
                            handleDraftEdit(draft.id, newBody)
                          }
                          onCancel={() => setEditingDraftId(null)}
                        />
                      ) : (
                        <div className="bg-white p-3 rounded border border-slate-200 text-sm text-slate-600 whitespace-pre-wrap">
                          {draft.editedBody || draft.body}
                        </div>
                      )}

                      {draft.status === "approved" && (
                        <button className="mt-3 px-4 py-2 bg-[#3f5ecc] hover:bg-[#3552b8] text-white rounded-lg text-sm font-medium flex items-center gap-2">
                          <Send className="w-4 h-4" /> Send Email
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "salary" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#3f5ecc]" />
                  Salary Recommendation & Strategy
                </h3>

                {/* Market Data Visualization */}
                <div className="bg-[#f5f7ff] p-6 rounded-lg border border-[#BDDEF3] mb-6">
                  <h4 className="text-sm font-medium text-slate-700 mb-4">
                    Market Salary Range
                  </h4>
                  <div className="relative h-12 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="absolute h-full bg-gradient-to-r from-green-300 via-green-400 to-green-500"
                      style={{
                        left: "10%",
                        width: "80%",
                      }}
                    />
                    {/* Markers */}
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-slate-600"
                      style={{ left: "25%" }}
                    >
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-slate-500">
                        25th
                      </span>
                    </div>
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-slate-800"
                      style={{ left: "50%" }}
                    >
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-slate-700 font-medium">
                        50th
                      </span>
                    </div>
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-slate-600"
                      style={{ left: "75%" }}
                    >
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-slate-500">
                        75th
                      </span>
                    </div>
                    {/* Recommended marker */}
                    <div
                      className="absolute top-0 bottom-0 w-2 bg-[#3f5ecc]"
                      style={{
                        left: `${
                          ((adjustedSalary -
                            salaryRec.marketData.percentile25) /
                            (salaryRec.marketData.percentile75 -
                              salaryRec.marketData.percentile25)) *
                            50 +
                          25
                        }%`,
                      }}
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-[#3f5ecc] font-bold whitespace-nowrap">
                        Offer: ${(adjustedSalary / 1000).toFixed(0)}k
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between mt-10 text-sm">
                    <span className="text-slate-500">
                      ${(salaryRec.marketData.percentile25 / 1000).toFixed(0)}k
                    </span>
                    <span className="text-slate-700 font-medium">
                      ${(salaryRec.marketData.percentile50 / 1000).toFixed(0)}k
                    </span>
                    <span className="text-slate-500">
                      ${(salaryRec.marketData.percentile75 / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-4 text-center">
                    Source: {salaryRec.marketData.source}
                  </p>
                </div>

                {/* AI Recommendation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <p className="text-xs text-slate-500 mb-1">Minimum</p>
                    <p className="text-2xl font-bold text-slate-700">
                      ${(salaryRec.min / 1000).toFixed(0)}k
                    </p>
                  </div>
                  <div className="p-4 bg-[#eef2ff] rounded-lg border border-[#3f5ecc] text-center">
                    <p className="text-xs text-[#3f5ecc] mb-1">
                      AI Recommended
                    </p>
                    <p className="text-2xl font-bold text-[#3f5ecc]">
                      ${(salaryRec.recommended / 1000).toFixed(0)}k
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <p className="text-xs text-slate-500 mb-1">Maximum</p>
                    <p className="text-2xl font-bold text-slate-700">
                      ${(salaryRec.max / 1000).toFixed(0)}k
                    </p>
                  </div>
                </div>

                {/* HR Adjustment */}
                <div className="border border-[#BDDEF3] rounded-lg p-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                    <Edit3 className="w-4 h-4" /> Adjust Offer Strategy
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-slate-600 block mb-2">
                        Adjusted Offer Amount
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">$</span>
                        <input
                          type="number"
                          value={adjustedSalary}
                          onChange={(e) =>
                            setAdjustedSalary(Number(e.target.value))
                          }
                          className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3f5ecc]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-slate-600 block mb-2">
                        Adjustment Reason
                      </label>
                      <textarea
                        value={salaryAdjustmentReason}
                        onChange={(e) =>
                          setSalaryAdjustmentReason(e.target.value)
                        }
                        placeholder="e.g., Candidate has competing offer, exceptional skills in key area..."
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3f5ecc] h-20 resize-none"
                      />
                    </div>
                    <button className="px-4 py-2 bg-[#3f5ecc] hover:bg-[#3552b8] text-white rounded-lg font-medium flex items-center gap-2">
                      <Save className="w-4 h-4" /> Save Offer Strategy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Score Override Modal */}
      {showScoreOverride && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Override AI Score
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-600 block mb-2">
                  New Score (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={overrideScore}
                  onChange={(e) => setOverrideScore(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3f5ecc]"
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 block mb-2">
                  Reason for Override
                </label>
                <textarea
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="Explain why you're adjusting the AI score..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3f5ecc] h-24 resize-none"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowScoreOverride(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleScoreOverride}
                  className="px-4 py-2 bg-[#3f5ecc] hover:bg-[#3552b8] text-white rounded-lg font-medium"
                >
                  Save Override
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Flag Modal */}
      {showFlagModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Flag className="w-5 h-5 text-amber-500" /> Flag for Special
              Consideration
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-600 block mb-2">
                  Reason for Flagging
                </label>
                <textarea
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value)}
                  placeholder="e.g., Referral from executive, exceptional portfolio, requires visa sponsorship review..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3f5ecc] h-24 resize-none"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowFlagModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFlagCandidate}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium flex items-center gap-2"
                >
                  <Flag className="w-4 h-4" /> Flag Candidate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Edit Question Form Component
const EditQuestionForm: React.FC<{
  question: InterviewQuestion;
  onSave: (question: string, lookingFor: string) => void;
  onCancel: () => void;
}> = ({ question, onSave, onCancel }) => {
  const [newQuestion, setNewQuestion] = useState(question.question);
  const [newLookingFor, setNewLookingFor] = useState(question.lookingFor);

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-slate-500 block mb-1">Question</label>
        <textarea
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3f5ecc] h-20 resize-none text-sm"
        />
      </div>
      <div>
        <label className="text-xs text-slate-500 block mb-1">Looking For</label>
        <input
          value={newLookingFor}
          onChange={(e) => setNewLookingFor(e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3f5ecc] text-sm"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-slate-500 hover:bg-slate-100 rounded text-sm"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(newQuestion, newLookingFor)}
          className="px-3 py-1.5 bg-[#3f5ecc] text-white rounded text-sm"
        >
          Save
        </button>
      </div>
    </div>
  );
};

// Edit Draft Form Component
const EditDraftForm: React.FC<{
  draft: CommunicationDraft;
  onSave: (body: string) => void;
  onCancel: () => void;
}> = ({ draft, onSave, onCancel }) => {
  const [newBody, setNewBody] = useState(draft.editedBody || draft.body);

  return (
    <div className="space-y-3">
      <textarea
        value={newBody}
        onChange={(e) => setNewBody(e.target.value)}
        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3f5ecc] h-48 resize-none text-sm"
      />
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-slate-500 hover:bg-slate-100 rounded text-sm"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(newBody)}
          className="px-3 py-1.5 bg-[#3f5ecc] text-white rounded text-sm"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default HRReviewDashboard;
