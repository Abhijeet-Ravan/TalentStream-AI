import type { PipelineCard } from '../utils';
import { CandidateSourceBadge } from '../../candidates/components/CandidateSourceBadge';
import { getMatchToneClassName } from '../../candidates/utils';
import { getNextAction } from '../utils';
import { PipelineCardActions } from './PipelineCardActions';

export const PipelineCandidateCard = (props: {
  card: PipelineCard;
}) => (
  <article className="rounded-lg border bg-card p-3">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-foreground">
          {props.card.candidate.name}
        </div>
        <div className="mt-0.5 truncate text-xs text-muted-foreground">
          {props.card.candidate.currentRole}
          {' at '}
          {props.card.candidate.currentCompany}
        </div>
      </div>
      <span className={`
        shrink-0 rounded-md border px-2 py-0.5 text-xs font-semibold
        ${getMatchToneClassName(props.card.candidate.matchScore)}
      `}
      >
        {props.card.candidate.matchScore}
        %
      </span>
    </div>

    <div className="mt-3 text-xs font-medium text-foreground">
      {props.card.job?.title ?? 'Unknown job'}
    </div>

    <div className="mt-3 flex flex-wrap gap-2">
      <CandidateSourceBadge source={props.card.candidate.source} />
    </div>

    <div className="
      mt-3 rounded-md bg-secondary p-2 text-xs text-muted-foreground
    "
    >
      {getNextAction(props.card.application.currentStage)}
    </div>
    <PipelineCardActions
      applicationId={props.card.application.id}
      currentStage={props.card.application.currentStage}
    />
  </article>
);
