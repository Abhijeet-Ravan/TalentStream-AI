'use client';

import type { Department, Job, JobStatus } from '../../types';
import { useMemo, useState } from 'react';
import { JobFilters } from './JobFilters';
import { JobStatusBadge } from './JobStatusBadge';

const formatEmploymentType = (employmentType: Job['employmentType']) => {
  const labelMap: Record<Job['employmentType'], string> = {
    consultant: 'Consultant',
    contract: 'Contract',
    full_time: 'Full time',
  };

  return labelMap[employmentType];
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));

export const JobsTable = (props: {
  departments: Department[];
  jobs: Job[];
}) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<JobStatus | 'all'>('all');
  const [department, setDepartment] = useState<Department | 'all'>('all');

  const filteredJobs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return props.jobs.filter((job) => {
      const matchesSearch = normalizedSearch.length === 0
        || job.title.toLowerCase().includes(normalizedSearch)
        || job.department.toLowerCase().includes(normalizedSearch)
        || job.location.toLowerCase().includes(normalizedSearch);
      const matchesStatus = status === 'all' || job.status === status;
      const matchesDepartment = department === 'all' || job.department === department;

      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [department, props.jobs, search, status]);

  return (
    <div className="space-y-4">
      <JobFilters
        department={department}
        departments={props.departments}
        onDepartmentChange={setDepartment}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        search={search}
        status={status}
      />

      <section className="rounded-lg border bg-card">
        <div className="
          flex items-center justify-between gap-3 border-b px-4 py-3
        "
        >
          <h2 className="text-base font-semibold text-foreground">
            Hiring Mandates
          </h2>
          <span className="text-sm text-muted-foreground">
            {filteredJobs.length}
            {' '}
            of
            {' '}
            {props.jobs.length}
            {' '}
            roles
          </span>
        </div>

        {filteredJobs.length === 0
          ? (
              <div className="px-4 py-8 text-sm text-muted-foreground">
                No jobs match the current filters.
              </div>
            )
          : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] text-left text-sm">
                  <thead className="
                    border-b bg-secondary text-xs font-semibold
                    text-muted-foreground uppercase
                  "
                  >
                    <tr>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Department</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Employment Type</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Open Positions</th>
                      <th className="px-4 py-3 text-right">Candidates</th>
                      <th className="px-4 py-3 text-right">Shortlisted</th>
                      <th className="px-4 py-3">Experience</th>
                      <th className="px-4 py-3">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredJobs.map(job => (
                      <tr key={job.id} className="align-top">
                        <td className="px-4 py-3 font-semibold text-foreground">
                          {job.title}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{job.department}</td>
                        <td className="px-4 py-3 text-muted-foreground">{job.location}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {formatEmploymentType(job.employmentType)}
                        </td>
                        <td className="px-4 py-3">
                          <JobStatusBadge status={job.status} />
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">
                          {job.openPositions}
                        </td>
                        <td className="px-4 py-3 text-right">{job.candidatesCount}</td>
                        <td className="px-4 py-3 text-right">{job.shortlistedCount}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {job.experienceMin}
                          -
                          {job.experienceMax}
                          {' yrs'}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {formatDate(job.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
      </section>
    </div>
  );
};
