export type Department
  = | 'Manufacturing'
    | 'Sales'
    | 'Supply Chain'
    | 'Finance'
    | 'Information Technology'
    | 'Research and Development'
    | 'Maintenance'
    | 'Marketing';

export type CandidateSource
  = | 'employee_referral'
    | 'linkedin'
    | 'naukri'
    | 'career_site'
    | 'agency'
    | 'walk_in'
    | 'campus'
    | 'internal';

export type JobStatus
  = | 'draft'
    | 'open'
    | 'paused'
    | 'closed';

export type ApplicationStatus
  = | 'active'
    | 'on_hold'
    | 'offer'
    | 'hired'
    | 'rejected'
    | 'withdrawn';

export type ScreeningStatus
  = | 'not_started'
    | 'queued'
    | 'in_progress'
    | 'completed'
    | 'failed';

export type InterviewStatus
  = | 'unscheduled'
    | 'scheduled'
    | 'completed'
    | 'cancelled'
    | 'feedback_pending';

export type PipelineStage
  = | 'sourced'
    | 'ai_recommended'
    | 'approved_for_screening'
    | 'screening_scheduled'
    | 'screened_awaiting_review'
    | 'shared_with_hiring_manager'
    | 'interview_scheduled_round_1'
    | 'interview_scheduled_round_2'
    | 'interview_scheduled_round_3'
    | 'awaiting_feedback'
    | 'offer_stage'
    | 'on_hold'
    | 'ai_matched'
    | 'screening_pending'
    | 'screened'
    | 'shortlisted'
    | 'interview_scheduled'
    | 'offer_final'
    | 'rejected';

export type EmploymentType
  = | 'full_time'
    | 'contract'
    | 'consultant';

export type AlertSeverity
  = | 'info'
    | 'warning'
    | 'critical';

export type CandidateSkill = {
  name: string;
  years: number;
  level: 'working' | 'proficient' | 'expert';
};

export type RecruiterMetric = {
  id: string;
  label: string;
  value: number;
  changePercent: number;
  trend: 'up' | 'down' | 'flat';
  description: string;
};

export type Job = {
  id: string;
  title: string;
  department: Department;
  location: string;
  employmentType: EmploymentType;
  status: JobStatus;
  openPositions: number;
  candidatesCount: number;
  shortlistedCount: number;
  experienceMin: number;
  experienceMax: number;
  requiredSkills: string[];
  preferredSkills: string[];
  createdAt: string;
};

export type Candidate = {
  id: string;
  name: string;
  email: string;
  phone: string;
  currentRole: string;
  currentCompany: string;
  location: string;
  experienceYears: number;
  skills: CandidateSkill[];
  source: CandidateSource;
  expectedSalary: string;
  noticePeriod: string;
  matchScore: number;
  matchReason: string;
  status: ApplicationStatus;
  appliedJobId: string;
  createdAt: string;
};

export type MatchScore = {
  id: string;
  jobId: string;
  candidateId: string;
  overallScore: number;
  skillScore: number;
  experienceScore: number;
  locationScore: number;
  compensationScore: number;
  summary: string;
  strengths: string[];
  gaps: string[];
  createdAt: string;
};

export type ScreeningSession = {
  id: string;
  candidateId: string;
  jobId: string;
  status: ScreeningStatus;
  channel: 'phone' | 'video' | 'in_person' | 'ai_voice';
  scheduledAt?: string;
  completedAt?: string;
  summary?: string;
  createdAt: string;
};

export type Interview = {
  id: string;
  candidateId: string;
  jobId: string;
  status: InterviewStatus;
  round: 'technical' | 'functional' | 'managerial' | 'hr' | 'leadership';
  interviewers: string[];
  scheduledAt?: string;
  feedbackDueAt?: string;
  createdAt: string;
};

export type Application = {
  id: string;
  jobId: string;
  candidateId: string;
  currentStage: PipelineStage;
  status: ApplicationStatus;
  matchScoreId: string;
  screeningSessionId?: string;
  interviewId?: string;
  createdAt: string;
  updatedAt: string;
};

export type RecruiterAlert = {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  relatedJobId?: string;
  relatedCandidateId?: string;
  createdAt: string;
};
