import type { PipelineCard } from '../utils';
import { pipelineStageOrder } from '../utils';
import { PipelineColumn } from './PipelineColumn';

export const PipelineBoard = (props: {
  cards: PipelineCard[];
}) => (
  <div className="overflow-x-auto">
    <div className="grid min-w-[1320px] grid-cols-4 gap-4">
      {pipelineStageOrder.map(stage => (
        <PipelineColumn
          key={stage}
          cards={props.cards.filter(card => card.application.currentStage === stage)}
          stage={stage}
        />
      ))}
    </div>
  </div>
);
