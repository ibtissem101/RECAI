export interface Candidate {
  id: string;
  name: string;
  role: string;
  score: number;
  hrOverrideScore?: number;
  hrOverrideReason?: string;
  status: "New" | "Screening" | "Interview" | "Offer" | "Rejected";
  applicationStatus?: "confirmed" | "waitlist" | "rejected";
  experienceYears: number;
  matchReason: string;
  skills: string[];
  missingSkills: string[];
  previousCompanies: CompanyHistory[];
  webVerification: WebVerification;
  email?: string;
  flaggedForReview?: boolean;
  flagReason?: string;
  aiReasoning?: AIReasoning;
  interviewQuestions?: InterviewQuestion[];
  communicationDrafts?: CommunicationDraft[];
  salaryRecommendation?: SalaryRecommendation;
}

export interface AIReasoning {
  summary: string;
  strengths: string[];
  concerns: string[];
  recommendation: "Strong Hire" | "Hire" | "Maybe" | "No Hire";
  confidenceScore: number;
  webSources: WebSource[];
}

export interface WebSource {
  type: "github" | "linkedin" | "portfolio" | "news" | "other";
  url: string;
  title: string;
  snippet: string;
  relevance: "high" | "medium" | "low";
  verifiedAt: string;
}

export interface InterviewQuestion {
  id: string;
  topic: string;
  question: string;
  lookingFor: string;
  edited?: boolean;
  editedBy?: string;
}

export interface CommunicationDraft {
  id: string;
  type: "interview_invite" | "rejection" | "offer" | "waitlist" | "follow_up";
  subject: string;
  body: string;
  status: "draft" | "approved" | "sent" | "rejected";
  approvedBy?: string;
  editedBody?: string;
}

export interface SalaryRecommendation {
  min: number;
  max: number;
  recommended: number;
  marketData: {
    percentile25: number;
    percentile50: number;
    percentile75: number;
    source: string;
  };
  hrAdjusted?: number;
  adjustmentReason?: string;
}

export interface RankedCandidatesResult {
  confirmed: Candidate[]; // Top 20%
  waitlist: Candidate[]; // Middle 60%
  rejected: Candidate[]; // Bottom 20%
  allRanked: Candidate[]; // All candidates sorted by score
  declined?: DeclinedFile[]; // Files that were not resumes
}

export interface DeclinedFile {
  fileName: string;
  reason: string;
  documentType?: string;
}

export interface CompanyHistory {
  name: string;
  role: string;
  duration: string;
  context: string; // e.g. "Series C, Scaled to 10k+"
}

export interface WebVerification {
  github?: {
    handle: string;
    contributions: number;
    topLanguages: string[];
    notableProject: string;
    verified: boolean;
  };
  linkedin?: {
    verified: boolean;
    roleMatch: boolean;
    connections?: number;
  };
  salaryBenchmark: {
    min: number;
    max: number;
    currency: string;
    location: string;
  };
  redFlags: string[];
}

export interface DashboardStats {
  totalApplicants: number;
  screened: number;
  webResearched: number;
  interviewsScheduled: number;
  avgProcessingTime: string;
}

export interface ProcessingStep {
  id: number;
  label: string;
  status: "pending" | "processing" | "completed";
  detail?: string;
  icon?: string;
}
