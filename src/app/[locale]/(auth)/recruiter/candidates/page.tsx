import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { CandidatesTable } from '@/features/recruitment/candidates/components/CandidatesTable';
import { CandidateSummaryCards } from '@/features/recruitment/candidates/components/CandidateSummaryCards';
import {
  getRecruitmentDbData,
  mapDbApplicationsToUiApplications,
  mapDbCandidatesToUiCandidates,
  mapDbJobsToUiJobs,
} from '@/features/recruitment/db-view-models';

export default async function RecruiterCandidatesPage() {
  const data = await getRecruitmentDbData();
  const applications = mapDbApplicationsToUiApplications(data);
  const candidates = mapDbCandidatesToUiCandidates(data);
  const jobs = mapDbJobsToUiJobs(data);

  return (
    <>
      <div className="
        mb-8 flex flex-col gap-4
        sm:flex-row sm:items-start sm:justify-between
      "
      >
        <TitleBar
          title="Candidates"
          description="Review sourced candidates, match scores, screening readiness, and hiring status."
        />
        <Button asChild>
          <Link href="/recruiter/candidates/new">Add Candidate</Link>
        </Button>
      </div>

      <div className="space-y-6">
        {candidates.length === 0
          ? (
              <section className="
                rounded-lg border bg-card p-6 text-sm text-muted-foreground
              "
              >
                No candidates yet. Seed demo data or add your first candidate.
              </section>
            )
          : (
              <>
                <CandidateSummaryCards applications={applications} candidates={candidates} />
                <CandidatesTable candidates={candidates} jobs={jobs} />
              </>
            )}
      </div>
    </>
  );
}
