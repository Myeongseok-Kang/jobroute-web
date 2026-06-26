import type {
  AlertConfig,
  CoverLetterDraft,
  CoverLetterReview,
  CoverLetterSample,
  InterviewQuestions,
  Job,
  JobListResponse,
  LoginResponse,
  MatchHistory,
  MatchResult,
  Resume,
  User,
} from "./types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "/api/backend";

const TOKEN_KEY = "jobroute_token";

export const tokenStore = {
  get(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(TOKEN_KEY);
  },
  set(token: string) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(TOKEN_KEY, token);
    window.dispatchEvent(new Event("jobroute:auth"));
  },
  clear() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new Event("jobroute:auth"));
  },
};

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  auth?: boolean;
  query?: Record<string, string | number | undefined | null>;
}

function buildQuery(query?: RequestOptions["query"]): string {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    params.append(key, String(value));
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, auth = false, query } = options;
  const headers: Record<string, string> = {
    "Content-Type": "application/json; charset=utf-8",
  };

  if (auth) {
    const token = tokenStore.get();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}${buildQuery(query)}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    if (res.status === 401) tokenStore.clear();
    if (res.status === 429) {
      throw new ApiError(
        "요청이 너무 많아요. 잠시 후 다시 시도해주세요.",
        429,
        data
      );
    }
    const message =
      (data &&
        typeof data === "object" &&
        "message" in data &&
        (Array.isArray((data as any).message)
          ? (data as any).message.join(", ")
          : String((data as any).message))) ||
      `요청 실패 (${res.status})`;
    throw new ApiError(message, res.status, data);
  }

  return data as T;
}

/* ----------------------------- Auth ----------------------------- */
export const authApi = {
  register: (input: { email: string; password: string; name?: string }) =>
    apiFetch<User>("/auth/register", { method: "POST", body: input }),

  login: (input: { email: string; password: string }) =>
    apiFetch<LoginResponse>("/auth/login", { method: "POST", body: input }),

  me: () => apiFetch<User>("/auth/me", { auth: true }),

  updateProfile: (body: { name?: string }) =>
    apiFetch<User>("/auth/me", { method: "PATCH", body, auth: true }),

  changePassword: (body: { currentPassword: string; newPassword: string }) =>
    apiFetch<{ ok: boolean }>("/auth/me/password", {
      method: "PATCH",
      body,
      auth: true,
    }),

  deleteAccount: () =>
    apiFetch<{ ok: boolean }>("/auth/me", { method: "DELETE", auth: true }),

  forgotPassword: (email: string) =>
    apiFetch<{ ok: boolean }>("/auth/password/forgot", {
      method: "POST",
      body: { email },
    }),

  resetPassword: (token: string, newPassword: string) =>
    apiFetch<{ ok: boolean }>("/auth/password/reset", {
      method: "POST",
      body: { token, newPassword },
    }),

  googleUrl: () => `${API_BASE_URL}/auth/google`,
  kakaoUrl: () => `${API_BASE_URL}/auth/kakao`,
};

/* ----------------------------- Jobs ----------------------------- */
export interface JobQuery {
  q?: string;
  region?: string;
  source?: string;
  employmentType?: string;
  career?: string;
  sort?: "latest" | "oldest";
  page?: number;
  size?: number;
}

export const jobsApi = {
  list: (query: JobQuery) =>
    apiFetch<JobListResponse>("/jobs", { query: query as any }),

  latest: (limit = 10) =>
    apiFetch<Job[]>("/jobs/latest", { query: { limit } }),

  popular: (limit = 10) =>
    apiFetch<Job[]>("/jobs/popular", { query: { limit } }),

  detail: (id: string) => apiFetch<Job>(`/jobs/${id}`),
};

/* ----------------------------- Matching ----------------------------- */
export const matchingApi = {
  byText: (body: {
    text: string;
    userCareer?: number;
    employmentType?: string;
    region?: string;
    limit?: number;
  }) => apiFetch<MatchResult>("/matching", { method: "POST", body }),

  byConditions: (body: {
    jobCategory?: string;
    skills?: string[];
    career?: string;
    employmentType?: string;
    region?: string;
    limit?: number;
  }) => apiFetch<MatchResult>("/matching/conditions", { method: "POST", body }),

  byResume: (
    resumeId: string,
    body: {
      userCareer?: number;
      employmentType?: string;
      region?: string;
      limit?: number;
    },
  ) =>
    apiFetch<MatchResult>(`/matching/resume/${resumeId}`, {
      method: "POST",
      body,
      auth: true,
    }),
};

/* ----------------------------- Resume ----------------------------- */
export const resumeApi = {
  create: (body: { content: string; title?: string }) =>
    apiFetch<Resume>("/resume", { method: "POST", body, auth: true }),

  list: () => apiFetch<Resume[]>("/resume", { auth: true }),

  detail: (id: string) => apiFetch<Resume>(`/resume/${id}`, { auth: true }),

  update: (id: string, body: { content?: string; title?: string }) =>
    apiFetch<Resume>(`/resume/${id}`, { method: "PATCH", body, auth: true }),

  remove: (id: string) =>
    apiFetch<void>(`/resume/${id}`, { method: "DELETE", auth: true }),
};

/* ----------------------------- Bookmark ----------------------------- */
export const bookmarkApi = {
  toggle: (jobId: string) =>
    apiFetch<{ bookmarked: boolean }>(`/bookmark/${jobId}`, {
      method: "POST",
      auth: true,
    }),

  list: () => apiFetch<Job[]>("/bookmark", { auth: true }),
};

/* ----------------------------- Match history ----------------------------- */
export const matchHistoryApi = {
  list: () => apiFetch<MatchHistory[]>("/match-history", { auth: true }),

  detail: (id: string) =>
    apiFetch<MatchHistory>(`/match-history/${id}`, { auth: true }),

  remove: (id: string) =>
    apiFetch<void>(`/match-history/${id}`, { method: "DELETE", auth: true }),
};

/* ----------------------------- Alert ----------------------------- */
export const alertApi = {
  get: () => apiFetch<AlertConfig | null>("/alert", { auth: true }),

  set: (body: { enabled: boolean; resumeId?: string }) =>
    apiFetch<AlertConfig>("/alert", { method: "POST", body, auth: true }),
};

/* ----------------------------- Interview ----------------------------- */
export const interviewApi = {
  general: (jobId: string) =>
    apiFetch<InterviewQuestions>(`/interview/${jobId}`, { method: "POST" }),

  personalized: (jobId: string, resumeId?: string) =>
    apiFetch<InterviewQuestions & { error?: string }>(
      `/interview/${jobId}/personalized`,
      {
        method: "POST",
        body: { resumeId },
        auth: true,
      },
    ),
};

/* ----------------------------- Cover letter ----------------------------- */
export const coverLetterApi = {
  search: (body: { query: string; jobCategory?: string }) =>
    apiFetch<CoverLetterSample[]>("/cover-letter/search", {
      method: "POST",
      body,
    }),

  draft: (jobId: string, resumeId?: string) =>
    apiFetch<CoverLetterDraft>(`/cover-letter/draft/${jobId}`, {
      method: "POST",
      body: { resumeId },
      auth: true,
    }),

  review: (body: { content: string }) =>
    apiFetch<CoverLetterReview>("/cover-letter/review", {
      method: "POST",
      body,
    }),
};
