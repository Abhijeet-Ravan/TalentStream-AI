import type { ScreeningRow } from '../utils';
import { getMatchToneClassName } from '../../candidates/utils';
import { formatDateTime } from '../utils';
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
          {props.rows.map(row => (
            <tr key={row.session.id} className="align-top">
              <td className="px-4 py-3">
                <div className="font-semibold text-foreground">
                  {row.candidate?.name ?? 'Unknown candidate'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {row.candidate?.currentRole ?? 'No role'}
                </div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {row.job?.title ?? 'Unknown job'}
              </td>
              <td className="px-4 py-3">
                <span className={`
                  rounded-md border px-2 py-0.5 text-xs font-semibold
                  ${getMatchToneClassName(row.candidate?.matchScore ?? 0)}
                `}
                >
                  {row.candidate?.matchScore ?? 0}
                  %
                </span>
              </td>
              <td className="px-4 py-3">
                <ScreeningStatusBadge status={row.session.status} />
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatDateTime(row.session.scheduledAt ?? row.session.createdAt)}
              </td>
              <td className="max-w-[320px] px-4 py-3 text-muted-foreground">
                {row.session.summary ?? 'Awaiting screening summary.'}
              </td>
              <td className="px-4 py-3">
                {row.application && <ScreeningActions applicationId={row.application.id} />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);
