import type { InterviewRow } from '../utils';
import { InterviewFeedbackForm } from '../../feedback/components/InterviewFeedbackForm';
import { formatDateTime, formatRound } from '../utils';
import { InterviewStatusBadge } from './InterviewStatusBadge';

export const InterviewsTable = (props: {
  rows: InterviewRow[];
}) => (
  <section className="rounded-lg border bg-card">
    <div className="border-b px-4 py-3">
      <h2 className="text-base font-semibold text-foreground">
        Interview Plan
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
            <th className="px-4 py-3">Interviewer</th>
            <th className="px-4 py-3">Scheduled</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Meeting Link</th>
            <th className="px-4 py-3">Notes / Feedback</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {props.rows.map(row => (
            <tr key={row.interview.id} className="align-top">
              <td className="px-4 py-3">
                <div className="font-semibold text-foreground">
                  {row.candidate?.name ?? 'Unknown candidate'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatRound(row.interview.round)}
                  {' round'}
                </div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {row.job?.title ?? 'Unknown job'}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {row.interview.interviewers.join(', ')}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatDateTime(row.interview.scheduledAt)}
              </td>
              <td className="px-4 py-3">
                <InterviewStatusBadge status={row.interview.status} />
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                No mock link
              </td>
              <td className="max-w-[280px] px-4 py-3 text-muted-foreground">
                {row.interview.status === 'feedback_pending'
                  ? `Feedback due ${formatDateTime(row.interview.feedbackDueAt)}.`
                  : 'No feedback captured yet.'}
                {row.application && (
                  <div className="mt-3">
                    <InterviewFeedbackForm
                      applicationId={row.application.id}
                      interviewId={row.interview.id}
                    />
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);
