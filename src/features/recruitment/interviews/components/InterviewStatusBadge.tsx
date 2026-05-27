import type { InterviewStatus } from '../../types';
import { interviewStatusLabels } from '../utils';

const statusClassName: Record<InterviewStatus, string> = {
  cancelled: 'border-destructive/20 bg-destructive/10 text-destructive',
  completed: 'border-success/20 bg-success/10 text-success',
  feedback_pending: 'border-warning/20 bg-warning/10 text-warning',
  scheduled: 'border-info/20 bg-info/10 text-info',
  unscheduled: 'border-border bg-secondary text-secondary-foreground',
};

export const InterviewStatusBadge = (props: {
  status: InterviewStatus;
}) => (
  <span className={`
    inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold
    ${statusClassName[props.status]}
  `}
  >
    {interviewStatusLabels[props.status]}
  </span>
);
