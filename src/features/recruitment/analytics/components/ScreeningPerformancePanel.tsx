import type { ScreeningSession } from '../../types';
import { getScreeningCompletionRate } from '../utils';

export const ScreeningPerformancePanel = (props: {
  screenings: ScreeningSession[];
}) => {
  const completionRate = getScreeningCompletionRate(props.screenings);

  return (
    <section className="rounded-lg border bg-card">
      <div className="border-b px-4 py-3">
        <h2 className="text-base font-semibold text-foreground">
          Screening Throughput
        </h2>
      </div>
      <div className="space-y-4 p-4">
        <div>
          <div className="mb-1 flex justify-between gap-3 text-sm">
            <span className="font-medium text-foreground">Completion rate</span>
            <span className="text-muted-foreground">
              {completionRate}
              %
            </span>
          </div>
          <div className="h-2 rounded-full bg-secondary">
            <div
              className="h-2 rounded-full bg-primary"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
        <div className="
          grid gap-3
          sm:grid-cols-3
        "
        >
          {['queued', 'in_progress', 'completed'].map(status => (
            <div key={status} className="rounded-md border bg-secondary p-3">
              <div className="
                text-xs font-semibold text-muted-foreground uppercase
              "
              >
                {status.replace('_', ' ')}
              </div>
              <div className="mt-1 text-lg font-semibold text-foreground">
                {props.screenings.filter(screening => screening.status === status).length}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
