import type { ApplicationStatus, PipelineStage } from '../../types';
import { formatStatus } from '../utils';

const statusClassName: Record<ApplicationStatus | PipelineStage, string> = {
  active: 'border-success/20 bg-success/10 text-success',
  ai_matched: 'border-info/20 bg-info/10 text-info',
  hired: 'border-success/20 bg-success/10 text-success',
  interview_scheduled: 'border-info/20 bg-info/10 text-info',
  offer: 'border-success/20 bg-success/10 text-success',
  offer_final: 'border-success/20 bg-success/10 text-success',
  on_hold: 'border-warning/20 bg-warning/10 text-warning',
  rejected: 'border-destructive/20 bg-destructive/10 text-destructive',
  screened: 'border-success/20 bg-success/10 text-success',
  screening_pending: 'border-warning/20 bg-warning/10 text-warning',
  shortlisted: 'border-primary/25 bg-accent text-accent-foreground',
  sourced: 'border-border bg-secondary text-secondary-foreground',
  withdrawn: 'border-border bg-secondary text-secondary-foreground',
};

export const CandidateStatusBadge = (props: {
  status: ApplicationStatus | PipelineStage;
}) => (
  <span className={`
    inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold
    ${statusClassName[props.status]}
  `}
  >
    {formatStatus(props.status)}
  </span>
);
