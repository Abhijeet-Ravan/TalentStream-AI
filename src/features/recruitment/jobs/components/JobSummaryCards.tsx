import type { Job } from '../../types';

type JobSummaryMetric = {
  id: string;
  label: string;
  value: number;
  description: string;
};

export const JobSummaryCards = (props: {
  jobs: Job[];
}) => {
  const metrics: JobSummaryMetric[] = [
    {
      id: 'open-roles',
      label: 'Open roles',
      value: props.jobs.filter(job => job.status === 'open').length,
      description: 'Roles actively accepting candidates.',
    },
    {
      id: 'draft-roles',
      label: 'Draft roles',
      value: props.jobs.filter(job => job.status === 'draft').length,
      description: 'Mandates still being prepared.',
    },
    {
      id: 'total-candidates',
      label: 'Total candidates',
      value: props.jobs.reduce((sum, job) => sum + job.candidatesCount, 0),
      description: 'Candidates attached to all jobs.',
    },
    {
      id: 'shortlisted-candidates',
      label: 'Shortlisted candidates',
      value: props.jobs.reduce((sum, job) => sum + job.shortlistedCount, 0),
      description: 'Profiles ready for next action.',
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
