import type { Job } from '../../types';
import { StatusBadge } from './StatusBadge';

export const ActiveJobsTable = (props: {
  jobs: Job[];
}) => (
  <section className="rounded-lg border bg-card">
    <div className="border-b px-4 py-3">
      <h2 className="text-base font-semibold text-foreground">
        Active Jobs
      </h2>
    </div>

    {props.jobs.length === 0
      ? (
          <div className="px-4 py-8 text-sm text-muted-foreground">
            No active jobs to show.
          </div>
        )
      : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="
                border-b bg-secondary text-xs font-semibold
                text-muted-foreground uppercase
              "
              >
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Open Positions</th>
                  <th className="px-4 py-3 text-right">Candidates</th>
                  <th className="px-4 py-3 text-right">Shortlisted</th>
                  <th className="px-4 py-3">Experience</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {props.jobs.map(job => (
                  <tr key={job.id} className="align-top">
                    <td className="px-4 py-3 font-semibold text-foreground">{job.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{job.department}</td>
                    <td className="px-4 py-3 text-muted-foreground">{job.location}</td>
                    <td className="px-4 py-3"><StatusBadge status={job.status} /></td>
                    <td className="px-4 py-3 text-right font-semibold">{job.openPositions}</td>
                    <td className="px-4 py-3 text-right">{job.candidatesCount}</td>
                    <td className="px-4 py-3 text-right">{job.shortlistedCount}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {job.experienceMin}
                      -
                      {job.experienceMax}
                      {' yrs'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
  </section>
);
