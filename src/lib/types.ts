
export type JobSource = "wanted" | "saramin" | "jobkorea" | string;

export interface Job {
  id: string;
  source: JobSource;
  sourceUrl: string;
  title: string;
  company: string;
  location?: string | null;
  region?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  hasBody?: boolean;
  createdAt: string;
  bookmarkCount?: number;
}

export interface JobListResponse {
  items: Job[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface User {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  provider?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface LoginResponse {
  accessToken: string;
}

export interface MatchReason {
  summary: string;
  matches: string[];
  confirm: string[];
}

export interface MatchCandidate {
  id: string;
  title: string;
  company: string;
  location?: string | null;
  region?: string | null;
  source: JobSource;
  sourceUrl: string;
  careerMin?: number | null;
  employmentType?: string | null;
  score: number;
  embedScore: number;
  trgmScore: number;
  careerScore: number;
  empScore: number;
  reason?: MatchReason;
}

export interface MatchResult {
  total: number;
  recommended: MatchCandidate[];
  moreCandidates: MatchCandidate[];
}

export interface Resume {
  id: string;
  userId: string;
  title?: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface MatchHistory {
  id: string;
  inputType: string;
  inputText?: string | null;
  result: MatchResult;
  createdAt: string;
}

export interface AlertConfig {
  id: string;
  userId: string;
  enabled: boolean;
  resumeId?: string | null;
  lastSentAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewQuestions {
  technical: string[];
  experience: string[];
  tips: string[];
}

export interface CoverLetterSample {
  id?: string;
  company: string;
  jobCategory: string;
  content?: string;
  score: number;
}

export interface CoverLetterDraft {
  draft: {
    지원동기: string;
    직무역량: string;
    입사후포부: string;
  };
  referencedSamples: CoverLetterSample[];
  error?: string;
}

export interface CoverLetterReview {
  review: {
    강점: string[];
    개선점: string[];
    총평: string;
  };
  referencedSamples: CoverLetterSample[];
}
