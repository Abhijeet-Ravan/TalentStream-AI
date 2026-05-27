import type { CanonicalPipelineStage } from '../../stage-utils';
import type { PipelineCard } from '../utils';
import { pipelineStageLabels } from '../utils';
import { PipelineCandidateCard } from './PipelineCandidateCard';

export const PipelineColumn = (props: {
  cards: PipelineCard[];
  stage: CanonicalPipelineStage;
}) => (
  <section className="min-w-[260px] rounded-lg border bg-secondary">
    <div className="flex items-center justify-between gap-3 border-b p-3">
      <h2 className="text-sm font-semibold text-foreground">
        {pipelineStageLabels[props.stage]}
      </h2>
      <span className="
        rounded-md border bg-card px-2 py-0.5 text-xs font-semibold
      "
      >
        {props.cards.length}
      </span>
    </div>

    <div className="space-y-3 p-3">
      {props.cards.length === 0
        ? (
            <div className="
              rounded-lg border bg-card p-3 text-xs text-muted-foreground
            "
            >
              No candidates in this stage.
            </div>
          )
        : props.cards.map(card => (
            <PipelineCandidateCard key={card.application.id} card={card} />
          ))}
    </div>
  </section>
);
