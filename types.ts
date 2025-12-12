export interface Candidate {
  id: string;
  name: string;
  role: string;
  score: number;
  status: 'New' | 'Screening' | 'Interview' | 'Offer' | 'Rejected';
  experienceYears: number;
  matchReason: string;
  skills: string[];
  missingSkills: string[];
  previousCompanies: CompanyHistory[];
  webVerification: WebVerification;
  email?: string;
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
  status: 'pending' | 'processing' | 'completed';
  detail?: string;
}
