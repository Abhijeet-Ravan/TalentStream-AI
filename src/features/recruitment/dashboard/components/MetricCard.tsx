import type { RecruiterMetric } from '../../types';

import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react';

type DashboardMetric = Pick<RecruiterMetric, 'id' | 'label' | 'value' | 'changePercent' | 'trend' | 'description'> & {
  valueSuffix?: string;
};

const trendIcon = {
  down: ArrowDownRight,
  flat: ArrowRight,
  up: ArrowUpRight,
};

const trendClassName = {
  down: 'text-success',
  flat: 'text-muted-foreground',
  up: 'text-primary',
};

export const MetricCard = (props: {
  metric: DashboardMetric;
}) => {
  const TrendIcon = trendIcon[props.metric.trend];
  const changePrefix = props.metric.changePercent > 0 ? '+' : '';

  return (
    <section className="rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-muted-foreground">
            {props.metric.label}
          </div>
          <div className="
            mt-2 flex items-baseline gap-1 text-2xl font-semibold
            text-foreground
          "
          >
            {props.metric.value.toLocaleString('en-IN')}
            {props.metric.valueSuffix && (
              <span className="text-base text-muted-foreground">
                {props.metric.valueSuffix}
              </span>
            )}
          </div>
        </div>

        <div className={`
          inline-flex items-center gap-1 rounded-md border border-border
          bg-secondary px-2 py-1 text-xs font-semibold
          ${trendClassName[props.metric.trend]}
        `}
        >
          <TrendIcon className="size-3.5" aria-hidden="true" />
          {changePrefix}
          {props.metric.changePercent}
          %
        </div>
      </div>

      <p className="mt-3 text-xs/5 text-muted-foreground">
        {props.metric.description}
      </p>
    </section>
  );
};

export type { DashboardMetric };
