import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { JobsTable } from '@/features/recruitment/jobs/components/JobsTable';
import { JobSummaryCards } from '@/features/recruitment/jobs/components/JobSummaryCards';
import { departments, jobs } from '@/features/recruitment/mock-data';

export default function RecruiterJobsPage() {
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
        <JobSummaryCards jobs={jobs} />
        <JobsTable departments={departments} jobs={jobs} />
      </div>
    </>
  );
}
