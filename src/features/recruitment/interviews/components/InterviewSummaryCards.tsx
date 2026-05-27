import type { Interview } from '../../types';
import { summarizeInterviews } from '../utils';

export const InterviewSummaryCards = (props: {
  interviews: Interview[];
}) => (
  <div className="
    grid gap-4
    sm:grid-cols-2
    xl:grid-cols-4
  "
  >
    {summarizeInterviews(props.interviews).map(metric => (
      <section key={metric.id} className="rounded-lg border bg-card p-4">
        <div className="text-sm font-medium text-muted-foreground">
          {metric.label}
        </div>
        <div className="mt-2 text-2xl font-semibold text-foreground">
          {metric.value}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          Interview loops in this state.
        </div>
      </section>
    ))}
  </div>
);
