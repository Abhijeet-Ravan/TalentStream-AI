import type { Department, JobStatus } from '../../types';

const statusOptions = [
  { label: 'All statuses', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'Draft', value: 'draft' },
  { label: 'Paused', value: 'paused' },
  { label: 'Closed', value: 'closed' },
] satisfies { label: string; value: JobStatus | 'all' }[];

export const JobFilters = (props: {
  departments: Department[];
  department: Department | 'all';
  onDepartmentChange: (department: Department | 'all') => void;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: JobStatus | 'all') => void;
  search: string;
  status: JobStatus | 'all';
}) => (
  <div className="
    grid gap-3 rounded-lg border bg-card p-4
    lg:grid-cols-[minmax(220px,1fr)_220px_240px]
  "
  >
    <label className="space-y-1.5">
      <span className="text-xs font-semibold text-muted-foreground uppercase">
        Search
      </span>
      <input
        className="h-10 w-full px-3 text-sm"
        onChange={event => props.onSearchChange(event.target.value)}
        placeholder="Title, department, or location"
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
        onChange={event => props.onStatusChange(event.target.value as JobStatus | 'all')}
        value={props.status}
      >
        {statusOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>

    <label className="space-y-1.5">
      <span className="text-xs font-semibold text-muted-foreground uppercase">
        Department
      </span>
      <select
        className="h-10 w-full px-3 text-sm"
        onChange={event => props.onDepartmentChange(event.target.value as Department | 'all')}
        value={props.department}
      >
        <option value="all">All departments</option>
        {props.departments.map(department => (
          <option key={department} value={department}>
            {department}
          </option>
        ))}
      </select>
    </label>
  </div>
);
