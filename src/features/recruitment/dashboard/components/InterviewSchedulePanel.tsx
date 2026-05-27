import type { Candidate, Interview, Job } from '../../types';

import { CalendarClock } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

const formatInterviewTime = (date: string) =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    hour: '2-digit',
    hour12: true,
    minute: '2-digit',
    month: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(date));

const formatRound = (round: Interview['round']) =>
  round.charAt(0).toUpperCase() + round.slice(1);

export const InterviewSchedulePanel = (props: {
  interviews: Interview[];
  candidatesById: Map<string, Candidate>;
  jobsById: Map<string, Job>;
}) => (
  <section className="rounded-lg border bg-card">
    <div className="border-b px-4 py-3">
      <h2 className="text-base font-semibold text-foreground">
        Today's Interviews
      </h2>
    </div>

    {props.interviews.length === 0
      ? (
          <div className="px-4 py-8 text-sm text-muted-foreground">
            No interviews scheduled today.
          </div>
        )
      : (
          <div className="divide-y">
            {props.interviews.map((interview) => {
              const candidate = props.candidatesById.get(interview.candidateId);
              const job = props.jobsById.get(interview.jobId);

              return (
                <article key={interview.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="
                      mt-0.5 rounded-md border border-border bg-secondary p-1.5
                      text-muted-foreground
                    "
                    >
                      <CalendarClock className="size-4" aria-hidden="true" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">
                            {candidate?.name ?? 'Unknown candidate'}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {job?.title ?? 'Unknown role'}
                            {' - '}
                            {formatRound(interview.round)}
                          </p>
                        </div>
                        <StatusBadge status={interview.status} />
                      </div>

                      <div className="
                        mt-3 text-xs font-semibold text-muted-foreground
                      "
                      >
                        {interview.scheduledAt ? formatInterviewTime(interview.scheduledAt) : 'Time not set'}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {interview.interviewers.join(', ')}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
  </section>
);
