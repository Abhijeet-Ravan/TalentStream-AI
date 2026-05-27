import type { Application, Candidate } from '../../types';

type CandidateSummaryMetric = {
  id: string;
  label: string;
  value: number;
  description: string;
};

export const CandidateSummaryCards = (props: {
  applications: Application[];
  candidates: Candidate[];
}) => {
  const applicationStagesByCandidateId = new Map(
    props.applications.map(application => [application.candidateId, application.currentStage]),
  );
  const metrics: CandidateSummaryMetric[] = [
    {
      description: 'Profiles available for recruiter review.',
      id: 'total-candidates',
      label: 'Total Candidates',
      value: props.candidates.length,
    },
    {
      description: 'Candidates currently in the AI matched stage.',
      id: 'ai-matched',
      label: 'AI Matched',
      value: props.candidates.filter(candidate =>
        applicationStagesByCandidateId.get(candidate.id) === 'ai_matched',
      ).length,
    },
    {
      description: 'Candidates waiting on screening action.',
      id: 'screening-pending',
      label: 'Screening Pending',
      value: props.candidates.filter(candidate =>
        applicationStagesByCandidateId.get(candidate.id) === 'screening_pending',
      ).length,
    },
    {
      description: 'Profiles shortlisted for hiring team review.',
      id: 'shortlisted',
      label: 'Shortlisted',
      value: props.candidates.filter(candidate =>
        applicationStagesByCandidateId.get(candidate.id) === 'shortlisted',
      ).length,
    },
  ];

  return (
    <div className="
      grid gap-4
      sm:grid-cols-2
      xl:grid-cols-4
    "
    >
      {metrics.map(metric => (
        <section key={metric.id} className="rounded-lg border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground">
            {metric.label}
          </div>
          <div className="mt-2 text-2xl font-semibold text-foreground">
            {metric.value}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {metric.description}
          </div>
        </section>
      ))}
    </div>
  );
};
