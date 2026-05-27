export const InterviewFeedbackCard = (props: {
  concerns?: string | null;
  overallRecommendation: string;
  reviewerName: string;
  strengths?: string | null;
}) => (
  <article className="rounded-lg border bg-card p-4">
    <div className="text-sm font-semibold text-foreground">
      {props.overallRecommendation.replaceAll('_', ' ')}
    </div>
    <div className="mt-1 text-xs text-muted-foreground">
      Submitted by
      {' '}
      {props.reviewerName}
    </div>
    <div className="
      mt-3 grid gap-3
      sm:grid-cols-2
    "
    >
      <div>
        <div className="text-xs font-semibold text-muted-foreground uppercase">
          Strengths
        </div>
        <div className="mt-1 text-sm text-foreground">
          {props.strengths ?? 'No strengths captured.'}
        </div>
      </div>
      <div>
        <div className="text-xs font-semibold text-muted-foreground uppercase">
          Concerns
        </div>
        <div className="mt-1 text-sm text-foreground">
          {props.concerns ?? 'No concerns captured.'}
        </div>
      </div>
    </div>
  </article>
);
