'use client';

import type { ScreeningRow } from '../utils';
import { getMatchToneClassName } from '../../candidates/utils';
import { getScreeningRecommendation } from '../utils';
import { ScreeningStatusBadge } from './ScreeningStatusBadge';

export const ScreeningResultCard = (props: {
  row: ScreeningRow;
}) => {
  // 1. Early guard: If there's no screening session yet, don't render the result card
  if (!props.row.session) {
    return null;
  }

  // 2. Safe destructuring now that the compiler knows session exists
  const { session } = props.row;
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
        {/* 3. Safely reading status from the guarded session variable */}
        <ScreeningStatusBadge status={session.status} />
      </div>

      <p className="mt-4 text-sm/6 text-muted-foreground">
        {/* 4. Safely reading summary */}
        {session.summary ?? 'Screening summary is not available yet.'}
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
