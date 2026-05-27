export const AnalyticsMetricCard = (props: {
  description: string;
  label: string;
  suffix?: string;
  value: number;
}) => (
  <section className="rounded-lg border bg-card p-4">
    <div className="text-sm font-medium text-muted-foreground">
      {props.label}
    </div>
    <div className="mt-2 text-2xl font-semibold text-foreground">
      {props.value}
      {props.suffix}
    </div>
    <div className="mt-1 text-xs text-muted-foreground">
      {props.description}
    </div>
  </section>
);
