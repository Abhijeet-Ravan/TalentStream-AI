import type { Candidate, Job, RecruiterAlert } from '../../types';

import { AlertCircle } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const PendingActionsPanel = (props: {
  alerts: RecruiterAlert[];
  candidatesById: Map<string, Candidate>;
  jobsById: Map<string, Job>;
}) => (
  <section className="rounded-lg border bg-card">
    <div className="border-b px-4 py-3">
      <h2 className="text-base font-semibold text-foreground">
        Pending Actions / Alerts
      </h2>
    </div>

    {props.alerts.length === 0
      ? (
          <div className="px-4 py-8 text-sm text-muted-foreground">
            No pending recruiter actions.
          </div>
        )
      : (
          <div className="divide-y">
            {props.alerts.map((alert) => {
              const candidate = alert.relatedCandidateId
                ? props.candidatesById.get(alert.relatedCandidateId)
                : undefined;
              const job = alert.relatedJobId
                ? props.jobsById.get(alert.relatedJobId)
                : undefined;

              return (
                <article key={alert.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="
                      mt-0.5 rounded-md border border-border bg-secondary p-1.5
                      text-muted-foreground
                    "
                    >
                      <AlertCircle className="size-4" aria-hidden="true" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-foreground">
                          {alert.title}
                        </h3>
                        <StatusBadge status={alert.severity} />
                      </div>
                      <p className="mt-1 text-sm/5 text-muted-foreground">
                        {alert.description}
                      </p>

                      {(candidate || job) && (
                        <div className="
                          mt-3 text-xs font-semibold text-muted-foreground
                        "
                        >
                          {candidate?.name}
                          {candidate && job ? ' - ' : ''}
                          {job?.title}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
  </section>
);
