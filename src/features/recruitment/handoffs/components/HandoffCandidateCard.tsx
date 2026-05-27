export const HandoffCandidateCard = (props: {
  candidateName: string;
  decision?: string;
  jobTitle: string;
  stage: string;
}) => (
  <article className="rounded-md border bg-secondary p-3">
    <div className="text-sm font-semibold text-foreground">{props.candidateName}</div>
    <div className="mt-1 text-xs text-muted-foreground">{props.jobTitle}</div>
    <div className="mt-2 text-xs text-muted-foreground">
      {props.decision ?? props.stage.replaceAll('_', ' ')}
    </div>
  </article>
);
