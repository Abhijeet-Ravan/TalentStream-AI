import type { Candidate } from '../../types';

import { BriefcaseBusiness, MapPin } from 'lucide-react';
import { MatchScoreBadge } from './MatchScoreBadge';
import { StatusBadge } from './StatusBadge';

const formatSource = (source: Candidate['source']) =>
  source
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const RecommendedCandidateCard = (props: {
  candidate: Candidate;
}) => {
  const topSkills = props.candidate.skills.slice(0, 3);

  return (
    <article className="rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-foreground">
              {props.candidate.name}
            </h3>
            <StatusBadge status={props.candidate.status} />
          </div>

          <div className="
            mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground
          "
          >
            <span className="inline-flex items-center gap-1.5">
              <BriefcaseBusiness className="size-3.5" aria-hidden="true" />
              {props.candidate.currentRole}
              {' at '}
              {props.candidate.currentCompany}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" aria-hidden="true" />
              {props.candidate.location}
            </span>
          </div>
        </div>

        <MatchScoreBadge score={props.candidate.matchScore} />
      </div>

      <div className="
        mt-4 grid gap-3
        sm:grid-cols-[1fr_auto]
      "
      >
        <p className="text-sm/5 text-foreground">
          {props.candidate.matchReason}
        </p>

        <div className="
          text-sm font-semibold text-muted-foreground
          sm:text-right
        "
        >
          {props.candidate.experienceYears}
          {' yrs exp'}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {topSkills.map(skill => (
          <span
            key={skill.name}
            className="
              rounded-md border border-border bg-secondary px-2 py-1 text-xs
              font-semibold text-secondary-foreground
            "
          >
            {skill.name}
          </span>
        ))}
      </div>

      <div className="
        mt-4 border-t pt-3 text-xs font-semibold text-muted-foreground
      "
      >
        Source:
        {' '}
        <span className="text-foreground">{formatSource(props.candidate.source)}</span>
      </div>
    </article>
  );
};
