import type { Application, Candidate, Interview, Job, ScreeningSession } from '../../types';
import { formatDateTime, formatStatus } from '../utils';

type TimelineItem = {
  description: string;
  id: string;
  label: string;
  timestamp?: string;
};

export const CandidateTimeline = (props: {
  application?: Application;
  candidate: Candidate;
  interview?: Interview;
  job?: Job;
  screeningSession?: ScreeningSession;
}) => {
  const items: TimelineItem[] = [
    {
      description: `Candidate sourced from ${props.candidate.source.replace('_', ' ')}.`,
      id: 'candidate-created',
      label: 'Candidate created',
      timestamp: props.candidate.createdAt,
    },
  ];

  if (props.application) {
    items.push({
      description: `Applied to ${props.job?.title ?? 'unknown job'} with ${formatStatus(props.application.currentStage)} stage.`,
      id: props.application.id,
      label: 'Application opened',
      timestamp: props.application.createdAt,
    });
  }

  if (props.screeningSession) {
    items.push({
      description: `${formatStatus(props.screeningSession.status)} via ${props.screeningSession.channel.replace('_', ' ')}.`,
      id: props.screeningSession.id,
      label: 'Screening session',
      timestamp: props.screeningSession.scheduledAt ?? props.screeningSession.createdAt,
    });
  }

  if (props.interview) {
    items.push({
      description: `${formatStatus(props.interview.round)} round with ${props.interview.interviewers.join(', ')}.`,
      id: props.interview.id,
      label: 'Interview',
      timestamp: props.interview.scheduledAt ?? props.interview.createdAt,
    });
  }

  return (
    <section className="rounded-lg border bg-card">
      <div className="border-b px-4 py-3">
        <h2 className="text-base font-semibold text-foreground">
          Timeline
        </h2>
      </div>
      <div className="space-y-4 p-4">
        {items.map(item => (
          <div key={item.id} className="flex gap-3">
            <div className="mt-1 size-2 rounded-full bg-primary" />
            <div className="
              min-w-0 flex-1 border-b pb-4
              last:border-b-0 last:pb-0
            "
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-semibold text-foreground">
                  {item.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDateTime(item.timestamp)}
                </div>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
