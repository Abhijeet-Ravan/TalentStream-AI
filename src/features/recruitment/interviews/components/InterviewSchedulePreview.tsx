import type { InterviewRow } from '../utils';
import { formatDateTime, formatRound } from '../utils';
import { InterviewStatusBadge } from './InterviewStatusBadge';

export const InterviewSchedulePreview = (props: {
  rows: InterviewRow[];
}) => (
  <section className="rounded-lg border bg-card">
    <div className="border-b px-4 py-3">
      <h2 className="text-base font-semibold text-foreground">
        Schedule Preview
      </h2>
    </div>
    <div className="space-y-3 p-4">
      {props.rows.length === 0
        ? (
            <div className="text-sm text-muted-foreground">
              No interviews scheduled.
            </div>
          )
        : props.rows.map(row => (
            <article
              key={row.interview.id}
              className="rounded-md border bg-secondary p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {row.candidate?.name ?? 'Unknown candidate'}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {row.job?.title ?? 'Unknown job'}
                  </div>
                </div>
                <InterviewStatusBadge status={row.interview.status} />
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                {formatDateTime(row.interview.scheduledAt)}
                {' · '}
                {formatRound(row.interview.round)}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {row.interview.interviewers.join(', ')}
              </div>
            </article>
          ))}
    </div>
  </section>
);
