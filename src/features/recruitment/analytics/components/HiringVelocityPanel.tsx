import type { Application, Job } from '../../types';
import { getAveragePipelineAgeDays } from '../utils';

export const HiringVelocityPanel = (props: {
  applications: Application[];
  jobs: Job[];
}) => {
  const averagePipelineAge = getAveragePipelineAgeDays(props.applications);
  const openPositions = props.jobs.reduce((sum, job) => sum + job.openPositions, 0);

  return (
    <section className="rounded-lg border bg-card">
      <div className="border-b px-4 py-3">
        <h2 className="text-base font-semibold text-foreground">
          Hiring Velocity
        </h2>
      </div>
      <div className="
        grid gap-3 p-4
        sm:grid-cols-2
      "
      >
        <div className="rounded-md border bg-secondary p-3">
          <div className="text-xs font-semibold text-muted-foreground uppercase">
            Avg pipeline movement
          </div>
          <div className="mt-1 text-lg font-semibold text-foreground">
            {averagePipelineAge}
            {' days'}
          </div>
        </div>
        <div className="rounded-md border bg-secondary p-3">
          <div className="text-xs font-semibold text-muted-foreground uppercase">
            Open positions
          </div>
          <div className="mt-1 text-lg font-semibold text-foreground">
            {openPositions}
          </div>
        </div>
      </div>
    </section>
  );
};
