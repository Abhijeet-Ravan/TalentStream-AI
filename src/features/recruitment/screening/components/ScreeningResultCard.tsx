import type { ScreeningRow } from '../utils';
import { getMatchToneClassName } from '../../candidates/utils';
import { getScreeningRecommendation } from '../utils';
import { ScreeningStatusBadge } from './ScreeningStatusBadge';

export const ScreeningResultCard = (props: {
  row: ScreeningRow;
}) => {
  const score = props.row.matchScore?.overallScore ?? props.row.candidate?.matchScore ?? 0;

  return (
    <article className="rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {props.row.candidate?.name ?? 'Unknown candidate'}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {props.row.job?.title ?? 'Unknown job'}
          </p>
        </div>
        <ScreeningStatusBadge status={props.row.session.status} />
      </div>

      <p className="mt-4 text-sm/6 text-muted-foreground">
        {props.row.session.summary ?? 'Screening summary is not available yet.'}
      </p>

      <div className="
        mt-4 grid gap-3
        sm:grid-cols-2
      "
      >
        <div className="rounded-md border bg-secondary p-3">
          <div className="text-xs font-semibold text-muted-foreground uppercase">
            AI score
          </div>
          <div className={`
            mt-1 inline-flex rounded-md border px-2 py-0.5 text-sm font-semibold
            ${getMatchToneClassName(score)}
          `}
          >
            {score}
            %
          </div>
        </div>
        <div className="rounded-md border bg-secondary p-3">
          <div className="text-xs font-semibold text-muted-foreground uppercase">
            Recommendation
          </div>
          <div className="mt-1 text-sm font-semibold text-foreground">
            {getScreeningRecommendation(score)}
          </div>
        </div>
      </div>
    </article>
  );
};
