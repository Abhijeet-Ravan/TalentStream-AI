import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { getRecruitmentDbData, mapDbJobsToUiJobs } from '@/features/recruitment/db-view-models';
import { recruitmentDepartments } from '@/features/recruitment/domain-options';
import { JobsTable } from '@/features/recruitment/jobs/components/JobsTable';
import { JobSummaryCards } from '@/features/recruitment/jobs/components/JobSummaryCards';

export default async function RecruiterJobsPage() {
  const data = await getRecruitmentDbData();
  const jobs = mapDbJobsToUiJobs(data);

  return (
    <>
      <div className="
        mb-8 flex flex-col gap-4
        sm:flex-row sm:items-start sm:justify-between
      "
      >
        <TitleBar
          title="Jobs"
          description="Create, track, and prioritize open hiring mandates."
        />
        <Button asChild>
          <Link href="/recruiter/jobs/new">
            Post New Job
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        {jobs.length === 0
          ? (
              <section className="rounded-lg border bg-card p-6">
                <div className="text-sm text-muted-foreground">
                  No jobs yet. Seed demo data or post your first job.
                </div>
              </section>
            )
          : (
              <>
                <JobSummaryCards jobs={jobs} />
                <JobsTable departments={recruitmentDepartments} jobs={jobs} />
              </>
            )}
      </div>
    </>
  );
}
