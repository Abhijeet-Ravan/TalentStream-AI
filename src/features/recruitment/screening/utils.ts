import type {
  Application,
  Candidate,
  Job,
  MatchScore,
  ScreeningSession,
  ScreeningStatus,
} from '../types';

export const screeningStatusLabels: Record<ScreeningStatus, string> = {
  completed: 'Completed',
  failed: 'Failed',
  in_progress: 'In Progress',
  not_started: 'Not Started',
  queued: 'Queued',
};

export type ScreeningRow = {
  application?: Application;
  candidate?: Candidate;
  job?: Job;
  matchScore?: MatchScore;
  session: ScreeningSession;
};

export const buildScreeningRows = (
  sessions: ScreeningSession[],
  applications: Application[],
  candidates: Candidate[],
  jobs: Job[],
  matchScores: MatchScore[],
) => {
  const applicationsByCandidateId = new Map(
    applications.map(application => [application.candidateId, application]),
  );
  const candidatesById = new Map(candidates.map(candidate => [candidate.id, candidate]));
  const jobsById = new Map(jobs.map(job => [job.id, job]));
  const matchScoresByCandidateId = new Map(
    matchScores.map(matchScore => [matchScore.candidateId, matchScore]),
  );

  return sessions.map(session => ({
    application: applicationsByCandidateId.get(session.candidateId),
    candidate: candidatesById.get(session.candidateId),
    job: jobsById.get(session.jobId),
    matchScore: matchScoresByCandidateId.get(session.candidateId),
    session,
  }));
};

export const summarizeScreenings = (sessions: ScreeningSession[]) => [
  {
    id: 'queued',
    label: 'Queued',
    value: sessions.filter(session => session.status === 'queued').length,
  },
  {
    id: 'in-progress',
    label: 'In Progress',
    value: sessions.filter(session => session.status === 'in_progress').length,
  },
  {
    id: 'completed',
    label: 'Completed',
    value: sessions.filter(session => session.status === 'completed').length,
  },
  {
    id: 'failed',
    label: 'Failed',
    value: sessions.filter(session => session.status === 'failed').length,
  },
];

export const formatDateTime = (date?: string) => {
  if (!date) {
    return 'Not scheduled';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
};

export const getScreeningRecommendation = (score: number) => {
  if (score >= 88) {
    return 'Prioritize for hiring team review';
  }

  if (score >= 80) {
    return 'Proceed after recruiter validation';
  }

  return 'Hold pending role calibration';
};
