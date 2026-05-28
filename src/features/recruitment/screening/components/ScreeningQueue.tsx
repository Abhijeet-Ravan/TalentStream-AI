import type { ScreeningRow } from '@/features/recruitment/screening/utils';
import { getMatchToneClassName } from '@/features/recruitment/candidates/utils';
import { formatDateTime } from '@/features/recruitment/screening/utils';
import { ScreeningActions } from './ScreeningActions';
import { ScreeningStatusBadge } from './ScreeningStatusBadge';

export const ScreeningQueue = (props: {
  rows: ScreeningRow[];
}) => (
  <section className="rounded-lg border bg-card">
    <div className="border-b px-4 py-3">
      <h2 className="text-base font-semibold text-foreground">
        Screening Queue
      </h2>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px] text-left text-sm">
        <thead className="
          border-b bg-secondary text-xs font-semibold text-muted-foreground
          uppercase
        "
        >
          <tr>
            <th className="px-4 py-3">Candidate</th>
            <th className="px-4 py-3">Job</th>
            <th className="px-4 py-3">Match</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Scheduled / Created</th>
            <th className="px-4 py-3">Summary</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {props.rows.length === 0
            ? (
                <tr>
                  <td
                    className="px-4 py-6 text-sm text-muted-foreground"
                    colSpan={7}
                  >
                    No eligible candidate applications yet. Add a candidate to a job first.
                  </td>
                </tr>
              )
            : props.rows.map(row => (
                <tr key={row.application.id}>
                  <td className="px-4 py-3 align-top">
                    <div className="font-medium text-foreground">
                      {row.candidate?.name ?? 'Unknown candidate'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {row.candidate?.currentRole ?? 'No role captured'}
                    </div>
                  </td>

                  <td className="px-4 py-3 align-top">
                    <div className="font-medium text-foreground">
                      {row.job?.title ?? 'Unknown job'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {row.job?.department ?? 'No department'}
                    </div>
                  </td>

                  <td className="px-4 py-3 align-top">
                    {row.matchScore
                      ? (
                          <span
                            className={getMatchToneClassName(row.matchScore.overallScore)}
                          >
                            {row.matchScore.overallScore}
                            %
                          </span>
                        )
                      : (
                          <span className="text-xs text-muted-foreground">
                            Not scored
                          </span>
                        )}
                  </td>

                  <td className="px-4 py-3 align-top">
                    <ScreeningStatusBadge
                      status={row.session?.status ?? 'not_started'}
                    />
                  </td>

                  <td className="
                    px-4 py-3 align-top text-xs text-muted-foreground
                  "
                  >
                    {formatDateTime(
                      row.session?.scheduledAt
                      ?? row.session?.createdAt
                      ?? row.application.createdAt,
                    )}
                  </td>

                  <td className="
                    max-w-[280px] px-4 py-3 align-top text-xs
                    text-muted-foreground
                  "
                  >
                    {row.session?.summary
                      ?? 'No screening session yet. Queue this application to begin AI screening.'}
                  </td>

                  <td className="px-4 py-3 align-top">
                    <ScreeningActions
                      applicationId={row.application.id}
                      hasSession={Boolean(row.session)}
                      candidate={row.candidate}
                      job={row.job}
                    />
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  </section>
);
