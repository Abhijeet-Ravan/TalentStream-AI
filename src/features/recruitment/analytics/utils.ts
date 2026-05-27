import type {
  Application,
  Candidate,
  CandidateSource,
  Interview,
  Job,
  ScreeningSession,
} from '../types';
import { formatSource } from '../candidates/utils';
import { pipelineStageLabels, pipelineStageOrder } from '../pipeline/utils';

export const getAnalyticsMetrics = (
  jobs: Job[],
  candidates: Candidate[],
  screenings: ScreeningSession[],
  interviews: Interview[],
) => {
  const averageMatchScore = candidates.length === 0
    ? 0
    : Math.round(
        candidates.reduce((sum, candidate) => sum + candidate.matchScore, 0) / candidates.length,
      );

  return [
    {
      description: 'Open hiring mandates.',
      id: 'open-jobs',
      label: 'Open jobs',
      value: jobs.filter(job => job.status === 'open').length,
    },
    {
      description: 'Candidates not closed out.',
      id: 'active-candidates',
      label: 'Active candidates',
      value: candidates.filter(candidate => candidate.status === 'active').length,
    },
    {
      description: 'Average candidate match quality.',
      id: 'average-match-score',
      label: 'Average match score',
      suffix: '%',
      value: averageMatchScore,
    },
    {
      description: 'Completed screening sessions.',
      id: 'screenings-completed',
      label: 'Screenings completed',
      value: screenings.filter(screening => screening.status === 'completed').length,
    },
    {
      description: 'Confirmed interview loops.',
      id: 'interviews-scheduled',
      label: 'Interviews scheduled',
      value: interviews.filter(interview => interview.status === 'scheduled').length,
    },
  ];
};

export const getApplicationsByStage = (applications: Application[]) =>
  pipelineStageOrder.map(stage => ({
    id: stage,
    label: pipelineStageLabels[stage],
    value: applications.filter(application => application.currentStage === stage).length,
  }));

export const getCandidatesBySource = (candidates: Candidate[]) => {
  const sources = [...new Set(candidates.map(candidate => candidate.source))] as CandidateSource[];

  return sources.map(source => ({
    id: source,
    label: formatSource(source),
    value: candidates.filter(candidate => candidate.source === source).length,
  }));
};

export const getAveragePipelineAgeDays = (applications: Application[]) => {
  if (applications.length === 0) {
    return 0;
  }

  const total = applications.reduce((sum, application) => {
    const createdAt = new Date(application.createdAt).getTime();
    const updatedAt = new Date(application.updatedAt).getTime();

    return sum + Math.max(updatedAt - createdAt, 0) / 86_400_000;
  }, 0);

  return Math.round(total / applications.length);
};

export const getScreeningCompletionRate = (screenings: ScreeningSession[]) => {
  if (screenings.length === 0) {
    return 0;
  }

  return Math.round(
    (screenings.filter(screening => screening.status === 'completed').length / screenings.length) * 100,
  );
};
