import type { Application } from '../../types';
import { getApplicationsByStage } from '../utils';

export const PipelineFunnel = (props: {
  applications: Application[];
}) => {
  const stages = getApplicationsByStage(props.applications);
  const maxValue = Math.max(...stages.map(stage => stage.value), 1);

  return (
    <section className="rounded-lg border bg-card">
      <div className="border-b px-4 py-3">
        <h2 className="text-base font-semibold text-foreground">
          Applications by Stage
        </h2>
      </div>
      <div className="space-y-3 p-4">
        {stages.map(stage => (
          <div key={stage.id}>
            <div className="mb-1 flex justify-between gap-3 text-sm">
              <span className="font-medium text-foreground">{stage.label}</span>
              <span className="text-muted-foreground">{stage.value}</span>
            </div>
            <div className="h-2 rounded-full bg-secondary">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${(stage.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
