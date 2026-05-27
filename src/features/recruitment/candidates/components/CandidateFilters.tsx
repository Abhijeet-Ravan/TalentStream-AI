import type { ApplicationStatus, CandidateSource, Job } from '../../types';
import { formatSource, formatStatus } from '../utils';

const candidateStatuses = [
  'active',
  'on_hold',
  'offer',
  'hired',
  'rejected',
  'withdrawn',
] satisfies ApplicationStatus[];

const candidateSources = [
  'employee_referral',
  'linkedin',
  'naukri',
  'career_site',
  'agency',
  'walk_in',
  'campus',
  'internal',
] satisfies CandidateSource[];

export const CandidateFilters = (props: {
  appliedJobId: string;
  jobs: Job[];
  matchScore: number;
  onAppliedJobChange: (jobId: string) => void;
  onMatchScoreChange: (score: number) => void;
  onSearchChange: (search: string) => void;
  onSourceChange: (source: CandidateSource | 'all') => void;
  onStatusChange: (status: ApplicationStatus | 'all') => void;
  search: string;
  source: CandidateSource | 'all';
  status: ApplicationStatus | 'all';
}) => (
  <div className="
    grid gap-3 rounded-lg border bg-card p-4
    lg:grid-cols-[minmax(220px,1fr)_180px_180px_180px_180px]
  "
  >
    <label className="space-y-1.5">
      <span className="text-xs font-semibold text-muted-foreground uppercase">
        Search
      </span>
      <input
        className="h-10 w-full px-3 text-sm"
        onChange={event => props.onSearchChange(event.target.value)}
        placeholder="Name, company, role, or skill"
        type="search"
        value={props.search}
      />
    </label>

    <label className="space-y-1.5">
      <span className="text-xs font-semibold text-muted-foreground uppercase">
        Status
      </span>
      <select
        className="h-10 w-full px-3 text-sm"
        onChange={event => props.onStatusChange(event.target.value as ApplicationStatus | 'all')}
        value={props.status}
      >
        <option value="all">All statuses</option>
        {candidateStatuses.map(status => (
          <option key={status} value={status}>
            {formatStatus(status)}
          </option>
        ))}
      </select>
    </label>

    <label className="space-y-1.5">
      <span className="text-xs font-semibold text-muted-foreground uppercase">
        Source
      </span>
      <select
        className="h-10 w-full px-3 text-sm"
        onChange={event => props.onSourceChange(event.target.value as CandidateSource | 'all')}
        value={props.source}
      >
        <option value="all">All sources</option>
        {candidateSources.map(source => (
          <option key={source} value={source}>
            {formatSource(source)}
          </option>
        ))}
      </select>
    </label>

    <label className="space-y-1.5">
      <span className="text-xs font-semibold text-muted-foreground uppercase">
        Min match
      </span>
      <input
        className="h-10 w-full px-3 text-sm"
        max="100"
        min="0"
        onChange={event => props.onMatchScoreChange(Number(event.target.value))}
        type="number"
        value={props.matchScore}
      />
    </label>

    <label className="space-y-1.5">
      <span className="text-xs font-semibold text-muted-foreground uppercase">
        Applied job
      </span>
      <select
        className="h-10 w-full px-3 text-sm"
        onChange={event => props.onAppliedJobChange(event.target.value)}
        value={props.appliedJobId}
      >
        <option value="all">All jobs</option>
        {props.jobs.map(job => (
          <option key={job.id} value={job.id}>
            {job.title}
          </option>
        ))}
      </select>
    </label>
  </div>
);
