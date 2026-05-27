import type {
  ApplicationStatus,
  CandidateSource,
  Interview,
  InterviewStatus,
  PipelineStage,
  ScreeningStatus,
} from '../types';

export const formatSource = (source: CandidateSource) => {
  const labelMap: Record<CandidateSource, string> = {
    agency: 'Agency',
    campus: 'Campus',
    career_site: 'Career site',
    employee_referral: 'Employee referral',
    internal: 'Internal',
    linkedin: 'LinkedIn',
    naukri: 'Naukri',
    walk_in: 'Walk-in',
  };

  return labelMap[source];
};

export const formatStatus = (
  status: ApplicationStatus | PipelineStage | ScreeningStatus | InterviewStatus | Interview['round'],
) =>
  status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

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

export const getMatchToneClassName = (score: number) => {
  if (score >= 88) {
    return 'border-primary/25 bg-accent text-accent-foreground';
  }

  if (score >= 80) {
    return 'border-info/20 bg-info/10 text-info';
  }

  return 'border-warning/20 bg-warning/10 text-warning';
};
