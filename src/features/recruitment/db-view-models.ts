import type {
  Application,
  Candidate,
  Interview,
  Job,
  MatchScore,
  PipelineStage,
  RecruiterAlert,
  RecruiterMetric,
  ScreeningSession,
} from './types';
import { and, eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import {
  applicationsSchema,
  candidatesSchema,
  hiringManagerDecisionsSchema,
  hiringManagerHandoffsSchema,
  interviewFeedbackSchema,
  interviewsSchema,
  jobsSchema,
  matchScoresSchema,
  screeningSessionsSchema,
} from '@/models/Schema';
import { getRecruitmentContext } from './server-context';

export type RecruitmentDbData = Awaited<ReturnType<typeof getRecruitmentDbData>>;
export type RecruitmentDbApplication = RecruitmentDbData['applications'][number];
export type RecruitmentDbHandoff = RecruitmentDbData['handoffs'][number];

export const getRecruitmentDbData = async () => {
  const { organizationId } = await getRecruitmentContext();
  const [
    jobs,
    candidates,
    applications,
    matchScores,
    screeningSessions,
    interviews,
    handoffs,
    decisions,
    feedback,
  ] = await Promise.all([
    db.select().from(jobsSchema).where(eq(jobsSchema.organizationId, organizationId)),
    db.select().from(candidatesSchema).where(eq(candidatesSchema.organizationId, organizationId)),
    db.select().from(applicationsSchema).where(eq(applicationsSchema.organizationId, organizationId)),
    db.select().from(matchScoresSchema).where(eq(matchScoresSchema.organizationId, organizationId)),
    db.select().from(screeningSessionsSchema).where(eq(screeningSessionsSchema.organizationId, organizationId)),
    db.select().from(interviewsSchema).where(eq(interviewsSchema.organizationId, organizationId)),
    db.select().from(hiringManagerHandoffsSchema).where(eq(hiringManagerHandoffsSchema.organizationId, organizationId)),
    db.select().from(hiringManagerDecisionsSchema).where(eq(hiringManagerDecisionsSchema.organizationId, organizationId)),
    db.select().from(interviewFeedbackSchema).where(eq(interviewFeedbackSchema.organizationId, organizationId)),
  ]);

  return {
    applications,
    candidates,
    decisions,
    feedback,
    handoffs,
    interviews,
    jobs,
    matchScores,
    screeningSessions,
  };
};

export const getJobDbDataById = async (jobId: string) => {
  const { organizationId } = await getRecruitmentContext();
  const [job] = await db
    .select()
    .from(jobsSchema)
    .where(and(eq(jobsSchema.id, jobId), eq(jobsSchema.organizationId, organizationId)));

  if (!job) {
    return undefined;
  }

  const data = await getRecruitmentDbData();

  return {
    ...data,
    job,
    jobApplications: data.applications.filter(application => application.jobId === job.id),
  };
};

export const getCandidateDbDataById = async (candidateId: string) => {
  const { organizationId } = await getRecruitmentContext();
  const [candidate] = await db
    .select()
    .from(candidatesSchema)
    .where(and(eq(candidatesSchema.id, candidateId), eq(candidatesSchema.organizationId, organizationId)));

  if (!candidate) {
    return undefined;
  }

  const data = await getRecruitmentDbData();

  return {
    ...data,
    candidate,
    candidateApplications: data.applications.filter(application => application.candidateId === candidate.id),
  };
};

const toIso = (date?: Date | null) => date?.toISOString() ?? new Date(0).toISOString();

export const mapDbJobsToUiJobs = (data: RecruitmentDbData): Job[] =>
  data.jobs.map(job => ({
    candidatesCount: data.applications.filter(application => application.jobId === job.id).length,
    createdAt: toIso(job.createdAt),
    department: job.department as Job['department'],
    employmentType: job.employmentType,
    experienceMax: job.experienceMax,
    experienceMin: job.experienceMin,
    id: job.id,
    location: job.location,
    openPositions: job.openPositions,
    preferredSkills: job.preferredSkills,
    requiredSkills: job.requiredSkills,
    shortlistedCount: data.applications.filter(application =>
      application.jobId === job.id
      && ['shared_with_hiring_manager', 'interview_scheduled_round_1', 'awaiting_feedback', 'offer_stage'].includes(application.currentStage),
    ).length,
    status: job.status,
    title: job.title,
  }));

export const mapDbCandidatesToUiCandidates = (data: RecruitmentDbData): Candidate[] => {
  const matchScoresByApplicationId = new Map(data.matchScores.map(score => [score.applicationId, score]));

  return data.candidates.map((candidate) => {
    const application = data.applications.find(item => item.candidateId === candidate.id);
    const matchScore = application ? matchScoresByApplicationId.get(application.id) : undefined;

    return {
      appliedJobId: application?.jobId ?? '',
      createdAt: toIso(candidate.createdAt),
      currentCompany: candidate.currentCompany,
      currentRole: candidate.currentRole,
      email: candidate.email,
      expectedSalary: candidate.expectedSalary,
      experienceYears: candidate.experienceYears,
      id: candidate.id,
      location: candidate.location,
      matchReason: matchScore?.explanation ?? 'No match score generated yet.',
      matchScore: matchScore?.score ?? 0,
      name: candidate.name,
      noticePeriod: candidate.noticePeriod,
      phone: candidate.phone,
      skills: candidate.skills,
      source: candidate.source,
      status: application?.status ?? 'active',
    };
  });
};

export const mapDbApplicationsToUiApplications = (data: RecruitmentDbData): Application[] => {
  const matchScoresByApplicationId = new Map(data.matchScores.map(score => [score.applicationId, score]));
  const screeningsByApplicationId = new Map(data.screeningSessions.map(session => [session.applicationId, session]));
  const interviewsByApplicationId = new Map(data.interviews.map(interview => [interview.applicationId, interview]));

  return data.applications.map(application => ({
    candidateId: application.candidateId,
    createdAt: toIso(application.createdAt),
    currentStage: application.currentStage as PipelineStage,
    id: application.id,
    interviewId: interviewsByApplicationId.get(application.id)?.id,
    jobId: application.jobId,
    matchScoreId: matchScoresByApplicationId.get(application.id)?.id ?? '',
    screeningSessionId: screeningsByApplicationId.get(application.id)?.id,
    status: application.status,
    updatedAt: toIso(application.updatedAt),
  }));
};

export const mapDbMatchScoresToUiMatchScores = (data: RecruitmentDbData): MatchScore[] =>
  data.matchScores.map((score) => {
    const application = data.applications.find(item => item.id === score.applicationId);

    return {
      candidateId: application?.candidateId ?? '',
      compensationScore: Number(score.featureScores.compensation ?? 0),
      createdAt: toIso(score.createdAt),
      experienceScore: Number(score.featureScores.experience ?? 0),
      gaps: score.negativeSignals,
      id: score.id,
      jobId: application?.jobId ?? '',
      locationScore: Number(score.featureScores.location ?? 0),
      overallScore: score.score,
      skillScore: Number(score.featureScores.requiredSkills ?? score.score),
      strengths: score.skillsMatched,
      summary: score.explanation,
    };
  });

export const mapDbScreeningsToUiScreenings = (data: RecruitmentDbData): ScreeningSession[] =>
  data.screeningSessions.map((session) => {
    const application = data.applications.find(item => item.id === session.applicationId);

    return {
      candidateId: application?.candidateId ?? '',
      channel: 'ai_voice',
      completedAt: session.status === 'completed' ? toIso(session.updatedAt) : undefined,
      createdAt: toIso(session.createdAt),
      id: session.id,
      jobId: application?.jobId ?? '',
      scheduledAt: toIso(session.createdAt),
      status: session.status,
      summary: session.summary ?? undefined,
    };
  });

export const mapDbInterviewsToUiInterviews = (data: RecruitmentDbData): Interview[] =>
  data.interviews.map((interview) => {
    const application = data.applications.find(item => item.id === interview.applicationId);

    return {
      candidateId: application?.candidateId ?? '',
      createdAt: toIso(interview.createdAt),
      feedbackDueAt: toIso(interview.updatedAt),
      id: interview.id,
      interviewers: [interview.interviewerName],
      jobId: application?.jobId ?? '',
      round: 'technical',
      scheduledAt: toIso(interview.scheduledAt),
      status: interview.status,
    };
  });

export const getDbRecruiterMetrics = (data: RecruitmentDbData): RecruiterMetric[] => {
  const averageMatch = data.matchScores.length === 0
    ? 0
    : Math.round(data.matchScores.reduce((sum, score) => sum + score.score, 0) / data.matchScores.length);

  return [
    {
      changePercent: 0,
      description: 'Open hiring mandates in the active organization.',
      id: 'metric-open-jobs',
      label: 'Open jobs',
      trend: 'flat',
      value: data.jobs.filter(job => job.status === 'open').length,
    },
    {
      changePercent: 0,
      description: 'Candidates with active applications.',
      id: 'metric-active-candidates',
      label: 'Active candidates',
      trend: 'flat',
      value: data.candidates.length,
    },
    {
      changePercent: 0,
      description: 'Queued or in-progress screening sessions.',
      id: 'metric-screenings-due',
      label: 'Screenings due',
      trend: 'flat',
      value: data.screeningSessions.filter(session => session.status === 'queued' || session.status === 'in_progress').length,
    },
    {
      changePercent: 0,
      description: 'Scheduled interviews in the active organization.',
      id: 'metric-interviews',
      label: 'Interviews scheduled',
      trend: 'flat',
      value: data.interviews.filter(interview => interview.status === 'scheduled').length,
    },
    {
      changePercent: 0,
      description: 'Average persisted deterministic match score.',
      id: 'metric-average-match',
      label: 'Average match score',
      trend: 'flat',
      value: averageMatch,
    },
  ];
};

export const getDbRecruiterAlerts = (): RecruiterAlert[] => [];
