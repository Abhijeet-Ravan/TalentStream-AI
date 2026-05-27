const getScoreClassName = (score: number) => {
  if (score >= 90) {
    return 'border-primary/25 bg-accent text-accent-foreground';
  }

  if (score >= 80) {
    return 'border-success/20 bg-success/10 text-success';
  }

  return 'border-warning/20 bg-warning/10 text-warning';
};

export const MatchScoreBadge = (props: {
  score: number;
}) => (
  <span className={`
    inline-flex min-w-14 items-center justify-center rounded-md border px-2 py-1
    text-sm font-semibold
    ${getScoreClassName(props.score)}
  `}
  >
    {props.score}
    %
  </span>
);
