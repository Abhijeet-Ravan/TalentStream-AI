import type { JobStatus } from '../../types';

const statusClassName: Record<JobStatus, string> = {
  closed: 'border-border bg-secondary text-secondary-foreground',
  draft: 'border-border bg-secondary text-secondary-foreground',
  open: 'border-success/20 bg-success/10 text-success',
  paused: 'border-warning/20 bg-warning/10 text-warning',
};

const statusLabel: Record<JobStatus, string> = {
  closed: 'Closed',
  draft: 'Draft',
  open: 'Open',
  paused: 'Paused',
};

export const JobStatusBadge = (props: {
  status: JobStatus;
}) => (
  <span className={`
    inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold
    ${statusClassName[props.status]}
  `}
  >
    {statusLabel[props.status]}
  </span>
);
