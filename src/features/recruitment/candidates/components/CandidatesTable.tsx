'use client';

import type { ApplicationStatus, Candidate, CandidateSource, Job } from '../../types';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getMatchToneClassName } from '../utils';
import { CandidateFilters } from './CandidateFilters';
import { CandidateSourceBadge } from './CandidateSourceBadge';
import { CandidateStatusBadge } from './CandidateStatusBadge';

export const CandidatesTable = (props: {
  candidates: Candidate[];
  jobs: Job[];
}) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ApplicationStatus | 'all'>('all');
  const [source, setSource] = useState<CandidateSource | 'all'>('all');
  const [matchScore, setMatchScore] = useState(0);
  const [appliedJobId, setAppliedJobId] = useState('all');

  const jobsById = useMemo(
    () => new Map(props.jobs.map(job => [job.id, job])),
    [props.jobs],
  );

  const filteredCandidates = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return props.candidates.filter((candidate) => {
      const skillText = candidate.skills.map(skill => skill.name).join(' ').toLowerCase();
      const searchableText = [
        candidate.name,
        candidate.currentCompany,
        candidate.currentRole,
        candidate.location,
        skillText,
      ].join(' ').toLowerCase();
      const matchesSearch = normalizedSearch.length === 0
        || searchableText.includes(normalizedSearch);
      const matchesStatus = status === 'all' || candidate.status === status;
      const matchesSource = source === 'all' || candidate.source === source;
      const matchesScore = candidate.matchScore >= matchScore;
      const matchesJob = appliedJobId === 'all' || candidate.appliedJobId === appliedJobId;

      return matchesSearch && matchesStatus && matchesSource && matchesScore && matchesJob;
    });
  }, [appliedJobId, matchScore, props.candidates, search, source, status]);

  return (
    <div className="space-y-4">
      <CandidateFilters
        appliedJobId={appliedJobId}
        jobs={props.jobs}
        matchScore={matchScore}
        onAppliedJobChange={setAppliedJobId}
        onMatchScoreChange={setMatchScore}
        onSearchChange={setSearch}
        onSourceChange={setSource}
        onStatusChange={setStatus}
        search={search}
        source={source}
        status={status}
      />

      <section className="rounded-lg border bg-card">
        <div className="
          flex items-center justify-between gap-3 border-b px-4 py-3
        "
        >
          <h2 className="text-base font-semibold text-foreground">
            Candidate Pipeline
          </h2>
          <span className="text-sm text-muted-foreground">
            {filteredCandidates.length}
            {' '}
            of
            {' '}
            {props.candidates.length}
            {' '}
            candidates
          </span>
        </div>

        {filteredCandidates.length === 0
          ? (
              <div className="px-4 py-8 text-sm text-muted-foreground">
                No candidates match the current filters.
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
                      <th className="px-4 py-3">Candidate</th>
                      <th className="px-4 py-3">Current Role / Company</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Experience</th>
                      <th className="px-4 py-3">Source</th>
                      <th className="px-4 py-3">Match Score</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Applied Job</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredCandidates.map((candidate) => {
                      const job = jobsById.get(candidate.appliedJobId);

                      return (
                        <tr key={candidate.id} className="align-top">
                          <td className="px-4 py-3">
                            <div className="font-semibold text-foreground">
                              {candidate.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {candidate.email}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-foreground">
                              {candidate.currentRole}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {candidate.currentCompany}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {candidate.location}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {candidate.experienceYears}
                            {' yrs'}
                          </td>
                          <td className="px-4 py-3">
                            <CandidateSourceBadge source={candidate.source} />
                          </td>
                          <td className="px-4 py-3">
                            <span className={`
                              inline-flex rounded-md border px-2 py-0.5 text-xs
                              font-semibold
                              ${getMatchToneClassName(candidate.matchScore)}
                            `}
                            >
                              {candidate.matchScore}
                              %
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <CandidateStatusBadge status={candidate.status} />
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {job?.title ?? 'Unknown job'}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button asChild size="sm" variant="outline">
                              <Link href={`/recruiter/candidates/${candidate.id}`}>
                                View
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
      </section>
    </div>
  );
};
