import type { Application, Candidate, Interview, InterviewStatus, Job } from '../types';

export const interviewStatusLabels: Record<InterviewStatus, string> = {
  cancelled: 'Cancelled',
  completed: 'Completed',
  feedback_pending: 'Feedback Pending',
  scheduled: 'Scheduled',
  unscheduled: 'Unscheduled',
};

export type InterviewRow = {
  application?: Application;
  candidate?: Candidate;
  interview: Interview;
  job?: Job;
};

export const buildInterviewRows = (
  interviews: Interview[],
  applications: Application[],
  candidates: Candidate[],
  jobs: Job[],
) => {
  const applicationsByCandidateId = new Map(
    applications.map(application => [application.candidateId, application]),
  );
  const candidatesById = new Map(candidates.map(candidate => [candidate.id, candidate]));
  const jobsById = new Map(jobs.map(job => [job.id, job]));

  return interviews.map(interview => ({
    application: applicationsByCandidateId.get(interview.candidateId),
    candidate: candidatesById.get(interview.candidateId),
    interview,
    job: jobsById.get(interview.jobId),
  }));
};

export const summarizeInterviews = (interviews: Interview[]) => [
  {
    id: 'scheduled',
    label: 'Scheduled',
    value: interviews.filter(interview => interview.status === 'scheduled').length,
  },
  {
    id: 'completed',
    label: 'Completed',
    value: interviews.filter(interview => interview.status === 'completed').length,
  },
  {
    id: 'feedback-pending',
    label: 'Feedback Pending',
    value: interviews.filter(interview => interview.status === 'feedback_pending').length,
  },
  {
    id: 'cancelled',
    label: 'Cancelled',
    value: interviews.filter(interview => interview.status === 'cancelled').length,
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

export const formatRound = (round: Interview['round']) =>
  round
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
