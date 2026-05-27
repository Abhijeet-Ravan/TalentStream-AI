import type { Candidate } from '../../types';
import { getCandidatesBySource } from '../utils';

export const SourceBreakdown = (props: {
  candidates: Candidate[];
}) => {
  const sources = getCandidatesBySource(props.candidates);
  const maxValue = Math.max(...sources.map(source => source.value), 1);

  return (
    <section className="rounded-lg border bg-card">
      <div className="border-b px-4 py-3">
        <h2 className="text-base font-semibold text-foreground">
          Candidates by Source
        </h2>
      </div>
      <div className="space-y-3 p-4">
        {sources.map(source => (
          <div key={source.id}>
            <div className="mb-1 flex justify-between gap-3 text-sm">
              <span className="font-medium text-foreground">{source.label}</span>
              <span className="text-muted-foreground">{source.value}</span>
            </div>
            <div className="h-2 rounded-full bg-secondary">
              <div
                className="h-2 rounded-full bg-info"
                style={{ width: `${(source.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
