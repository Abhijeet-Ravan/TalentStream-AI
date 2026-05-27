import type { Candidate, Job, MatchScore } from '../../types';
import { getMatchToneClassName } from '../utils';

export const CandidateMatchSummary = (props: {
  candidate: Candidate;
  job?: Job;
  matchScore?: MatchScore;
}) => (
  <section className="rounded-lg border bg-card">
    <div className="border-b px-4 py-3">
      <h2 className="text-base font-semibold text-foreground">
        Match Summary
      </h2>
    </div>
    <div className="space-y-4 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-muted-foreground">
            Applied job
          </div>
          <div className="mt-1 text-sm font-semibold text-foreground">
            {props.job?.title ?? 'Unknown job'}
          </div>
          {props.job && (
            <div className="text-xs text-muted-foreground">
              {props.job.department}
              {' · '}
              {props.job.location}
            </div>
          )}
        </div>
        <span className={`
          inline-flex rounded-md border px-2.5 py-1 text-sm font-semibold
          ${getMatchToneClassName(props.candidate.matchScore)}
        `}
        >
          {props.candidate.matchScore}
          % match
        </span>
      </div>

      <p className="text-sm/6 text-muted-foreground">
        {props.candidate.matchReason}
      </p>

      {props.matchScore && (
        <div className="
          grid gap-3 border-t pt-4
          sm:grid-cols-2
        "
        >
          {[
            ['Skill', props.matchScore.skillScore],
            ['Experience', props.matchScore.experienceScore],
            ['Location', props.matchScore.locationScore],
            ['Compensation', props.matchScore.compensationScore],
          ].map(([label, score]) => (
            <div key={label} className="rounded-md border bg-secondary p-3">
              <div className="
                text-xs font-semibold text-muted-foreground uppercase
              "
              >
                {label}
              </div>
              <div className="mt-1 text-lg font-semibold text-foreground">
                {score}
                %
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
);
