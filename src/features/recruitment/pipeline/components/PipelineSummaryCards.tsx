import type { Application } from '../../types';
import { summarizePipeline } from '../utils';

export const PipelineSummaryCards = (props: {
  applications: Application[];
}) => {
  const metrics = summarizePipeline(props.applications);

  return (
    <div className="
      grid gap-4
      sm:grid-cols-2
      xl:grid-cols-4
    "
    >
      {metrics.slice(0, 4).map(metric => (
        <section key={metric.id} className="rounded-lg border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground">
            {metric.label}
          </div>
          <div className="mt-2 text-2xl font-semibold text-foreground">
            {metric.value}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Current applications in stage.
          </div>
        </section>
      ))}
    </div>
  );
};
