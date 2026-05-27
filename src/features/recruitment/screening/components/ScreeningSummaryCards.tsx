import type { ScreeningSession } from '../../types';
import { summarizeScreenings } from '../utils';

export const ScreeningSummaryCards = (props: {
  sessions: ScreeningSession[];
}) => (
  <div className="
    grid gap-4
    sm:grid-cols-2
    xl:grid-cols-4
  "
  >
    {summarizeScreenings(props.sessions).map(metric => (
      <section key={metric.id} className="rounded-lg border bg-card p-4">
        <div className="text-sm font-medium text-muted-foreground">
          {metric.label}
        </div>
        <div className="mt-2 text-2xl font-semibold text-foreground">
          {metric.value}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          AI screening sessions in this state.
        </div>
      </section>
    ))}
  </div>
);
