export const HandoffSummaryCards = (props: {
  handoffs: { status: string }[];
}) => {
  const metrics = [
    { label: 'Total', value: props.handoffs.length },
    { label: 'Mock Sent', value: props.handoffs.filter(item => item.status === 'mock_sent').length },
    { label: 'Responded', value: props.handoffs.filter(item => item.status === 'responded').length },
    { label: 'Draft', value: props.handoffs.filter(item => item.status === 'draft').length },
  ];

  return (
    <div className="
      grid gap-4
      sm:grid-cols-2
      xl:grid-cols-4
    "
    >
      {metrics.map(metric => (
        <section key={metric.label} className="rounded-lg border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground">{metric.label}</div>
          <div className="mt-2 text-2xl font-semibold text-foreground">{metric.value}</div>
        </section>
      ))}
    </div>
  );
};
