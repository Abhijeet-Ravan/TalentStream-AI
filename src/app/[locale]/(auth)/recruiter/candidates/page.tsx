import { TitleBar } from '@/features/dashboard/TitleBar';
import { CandidatesTable } from '@/features/recruitment/candidates/components/CandidatesTable';
import { CandidateSummaryCards } from '@/features/recruitment/candidates/components/CandidateSummaryCards';
import { applications, candidates, jobs } from '@/features/recruitment/mock-data';

export default function RecruiterCandidatesPage() {
  return (
    <>
      <TitleBar
        title="Candidates"
        description="Review sourced candidates, match scores, screening readiness, and hiring status."
      />

      <div className="space-y-6">
        <CandidateSummaryCards applications={applications} candidates={candidates} />
        <CandidatesTable candidates={candidates} jobs={jobs} />
      </div>
    </>
  );
}
