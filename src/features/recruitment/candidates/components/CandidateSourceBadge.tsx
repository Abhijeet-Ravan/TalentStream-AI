import type { CandidateSource } from '../../types';
import { formatSource } from '../utils';

const sourceClassName: Record<CandidateSource, string> = {
  agency: 'border-warning/20 bg-warning/10 text-warning',
  campus: 'border-info/20 bg-info/10 text-info',
  career_site: 'border-border bg-secondary text-secondary-foreground',
  employee_referral: 'border-primary/25 bg-accent text-accent-foreground',
  internal: 'border-success/20 bg-success/10 text-success',
  linkedin: 'border-info/20 bg-info/10 text-info',
  naukri: 'border-primary/25 bg-accent text-accent-foreground',
  walk_in: 'border-border bg-secondary text-secondary-foreground',
};

export const CandidateSourceBadge = (props: {
  source: CandidateSource;
}) => (
  <span className={`
    inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold
    ${sourceClassName[props.source]}
  `}
  >
    {formatSource(props.source)}
  </span>
);
