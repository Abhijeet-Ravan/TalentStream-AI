import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { CandidateMatchSummary } from '@/features/recruitment/candidates/components/CandidateMatchSummary';
import { CandidateProfileCard } from '@/features/recruitment/candidates/components/CandidateProfileCard';
import { CandidateSkills } from '@/features/recruitment/candidates/components/CandidateSkills';
import { CandidateTimeline } from '@/features/recruitment/candidates/components/CandidateTimeline';
import {
  applications,
  candidates,
  interviews,
  jobs,
  matchScores,
  screeningSessions,
} from '@/features/recruitment/mock-data';

type RecruiterCandidateDetailPageProps = {
  params: Promise<{ candidateId: string }>;
};

export default async function RecruiterCandidateDetailPage(
  props: RecruiterCandidateDetailPageProps,
) {
  const { candidateId } = await props.params;
  const candidate = candidates.find(item => item.id === candidateId);

  if (!candidate) {
    return (
      <>
        <TitleBar
          title="Candidate Not Found"
          description="The requested candidate is not available in the mock recruitment dataset."
        />
        <section className="rounded-lg border bg-card p-6">
          <div className="text-sm text-muted-foreground">
            Return to the candidate list and select an available profile.
          </div>
          <div className="mt-4">
            <Button asChild variant="outline">
              <Link href="/recruiter/candidates">
                Back to Candidates
              </Link>
            </Button>
          </div>
        </section>
      </>
    );
  }

  const application = applications.find(item => item.candidateId === candidate.id);
  const job = jobs.find(item => item.id === candidate.appliedJobId);
  const matchScore = matchScores.find(item => item.candidateId === candidate.id);
  const screeningSession = screeningSessions.find(item => item.candidateId === candidate.id);
  const interview = interviews.find(item => item.candidateId === candidate.id);

  return (
    <>
      <TitleBar
        title="Candidate Details"
        description="Inspect candidate fit, application context, screening readiness, and hiring activity."
      />

      <div className="
        grid gap-6
        xl:grid-cols-[minmax(0,1fr)_360px]
      "
      >
        <div className="min-w-0 space-y-6">
          <CandidateProfileCard
            application={application}
            candidate={candidate}
            interview={interview}
            job={job}
            screeningSession={screeningSession}
          />
          <CandidateMatchSummary
            candidate={candidate}
            job={job}
            matchScore={matchScore}
          />
          <CandidateTimeline
            application={application}
            candidate={candidate}
            interview={interview}
            job={job}
            screeningSession={screeningSession}
          />
        </div>

        <aside className="space-y-6">
          <CandidateSkills skills={candidate.skills} />
        </aside>
      </div>
    </>
  );
}
