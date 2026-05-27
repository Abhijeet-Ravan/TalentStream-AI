import type { ScreeningStatus } from '../../types';
import { screeningStatusLabels } from '../utils';

const statusClassName: Record<ScreeningStatus, string> = {
  completed: 'border-success/20 bg-success/10 text-success',
  failed: 'border-destructive/20 bg-destructive/10 text-destructive',
  in_progress: 'border-info/20 bg-info/10 text-info',
  not_started: 'border-border bg-secondary text-secondary-foreground',
  queued: 'border-warning/20 bg-warning/10 text-warning',
};

export const ScreeningStatusBadge = (props: {
  status: ScreeningStatus;
}) => (
  <span className={`
    inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold
    ${statusClassName[props.status]}
  `}
  >
    {screeningStatusLabels[props.status]}
  </span>
);
