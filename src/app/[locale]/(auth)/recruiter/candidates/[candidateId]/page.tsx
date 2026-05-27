import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { AddToJobForm } from '@/features/recruitment/applications/components/AddToJobForm';
import { CandidateMatchSummary } from '@/features/recruitment/candidates/components/CandidateMatchSummary';
import { CandidateProfileCard } from '@/features/recruitment/candidates/components/CandidateProfileCard';
import { CandidateSkills } from '@/features/recruitment/candidates/components/CandidateSkills';
import { CandidateTimeline } from '@/features/recruitment/candidates/components/CandidateTimeline';
import {
  getCandidateDbDataById,
  mapDbApplicationsToUiApplications,
  mapDbCandidatesToUiCandidates,
  mapDbInterviewsToUiInterviews,
  mapDbJobsToUiJobs,
  mapDbMatchScoresToUiMatchScores,
  mapDbScreeningsToUiScreenings,
} from '@/features/recruitment/db-view-models';

type RecruiterCandidateDetailPageProps = {
  params: Promise<{ candidateId: string }>;
};

export default async function RecruiterCandidateDetailPage(
  props: RecruiterCandidateDetailPageProps,
) {
  const { candidateId } = await props.params;
  const data = await getCandidateDbDataById(candidateId);

  if (!data) {
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

  const candidates = mapDbCandidatesToUiCandidates(data);
  const candidate = candidates.find(item => item.id === data.candidate.id)!;
  const applications = mapDbApplicationsToUiApplications(data);
  const jobs = mapDbJobsToUiJobs(data);
  const matchScores = mapDbMatchScoresToUiMatchScores(data);
  const screeningSessions = mapDbScreeningsToUiScreenings(data);
  const interviews = mapDbInterviewsToUiInterviews(data);
  const application = applications.find(item => item.candidateId === candidate.id);
  const job = jobs.find(item => item.id === application?.jobId);
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
          <section className="rounded-lg border bg-card">
            <div className="border-b px-4 py-3">
              <h2 className="text-base font-semibold text-foreground">
                Decisions and Feedback
              </h2>
            </div>
            <div className="space-y-3 p-4">
              {data.decisions.filter(decision =>
                data.candidateApplications.some(application => application.id === decision.applicationId),
              ).length === 0 && data.feedback.filter(feedback =>
                data.candidateApplications.some(application => application.id === feedback.applicationId),
              ).length === 0
                ? (
                    <div className="text-sm text-muted-foreground">
                      No hiring-manager decisions or interview feedback captured yet.
                    </div>
                  )
                : (
                    <>
                      {data.decisions.filter(decision =>
                        data.candidateApplications.some(application => application.id === decision.applicationId),
                      ).map(decision => (
                        <div
                          key={decision.id}
                          className="rounded-md border bg-secondary p-3"
                        >
                          <div className="text-sm font-semibold text-foreground">
                            Manager decision:
                            {' '}
                            {decision.decision.replaceAll('_', ' ')}
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {decision.reason ?? 'No reason captured.'}
                          </div>
                        </div>
                      ))}
                      {data.feedback.filter(feedback =>
                        data.candidateApplications.some(application => application.id === feedback.applicationId),
                      ).map(feedback => (
                        <div
                          key={feedback.id}
                          className="rounded-md border bg-secondary p-3"
                        >
                          <div className="text-sm font-semibold text-foreground">
                            Interview feedback:
                            {' '}
                            {feedback.overallRecommendation.replaceAll('_', ' ')}
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {feedback.strengths ?? 'No strengths captured.'}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <AddToJobForm
            candidateId={candidate.id}
            jobs={jobs.filter(item => !applications.some(application =>
              application.candidateId === candidate.id && application.jobId === item.id,
            ))}
          />
          <CandidateSkills skills={candidate.skills} />
        </aside>
      </div>
    </>
  );
}
