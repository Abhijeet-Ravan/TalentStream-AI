type BadgeTone = 'neutral' | 'success' | 'warning' | 'critical' | 'info';

const toneClassName: Record<BadgeTone, string> = {
  neutral: 'border-border bg-secondary text-secondary-foreground',
  success: 'border-success/20 bg-success/10 text-success',
  warning: 'border-warning/20 bg-warning/10 text-warning',
  critical: 'border-destructive/20 bg-destructive/10 text-destructive',
  info: 'border-info/20 bg-info/10 text-info',
};

const statusToneMap: Record<string, BadgeTone> = {
  active: 'success',
  ai_matched: 'info',
  cancelled: 'critical',
  closed: 'neutral',
  completed: 'success',
  critical: 'critical',
  draft: 'neutral',
  failed: 'critical',
  feedback_pending: 'warning',
  hired: 'success',
  in_progress: 'info',
  info: 'info',
  interview_scheduled: 'info',
  not_started: 'neutral',
  offer: 'success',
  offer_final: 'success',
  on_hold: 'warning',
  open: 'success',
  paused: 'warning',
  queued: 'warning',
  rejected: 'critical',
  scheduled: 'info',
  screened: 'success',
  screening_pending: 'warning',
  shortlisted: 'info',
  sourced: 'neutral',
  unscheduled: 'neutral',
  warning: 'warning',
  withdrawn: 'neutral',
};

const formatStatus = (status: string) =>
  status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const StatusBadge = (props: {
  status: string;
  label?: string;
}) => {
  const tone = statusToneMap[props.status] ?? 'neutral';

  return (
    <span className={`
      inline-flex items-center rounded-md border px-2 py-0.5 text-xs
      font-semibold
      ${toneClassName[tone]}
    `}
    >
      {props.label ?? formatStatus(props.status)}
    </span>
  );
};
