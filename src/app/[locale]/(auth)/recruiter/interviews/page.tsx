import { TitleBar } from '@/features/dashboard/TitleBar';
import {
  getRecruitmentDbData,
  mapDbApplicationsToUiApplications,
  mapDbCandidatesToUiCandidates,
  mapDbInterviewsToUiInterviews,
  mapDbJobsToUiJobs,
} from '@/features/recruitment/db-view-models';
import { InterviewSchedulePreview } from '@/features/recruitment/interviews/components/InterviewSchedulePreview';
import { InterviewsTable } from '@/features/recruitment/interviews/components/InterviewsTable';
import { InterviewSummaryCards } from '@/features/recruitment/interviews/components/InterviewSummaryCards';
import { ScheduleInterviewForm } from '@/features/recruitment/interviews/components/ScheduleInterviewForm';
import { buildInterviewRows } from '@/features/recruitment/interviews/utils';

export default async function RecruiterInterviewsPage() {
  const data = await getRecruitmentDbData();
  const applications = mapDbApplicationsToUiApplications(data);
  const candidates = mapDbCandidatesToUiCandidates(data);
  const jobs = mapDbJobsToUiJobs(data);
  const interviews = mapDbInterviewsToUiInterviews(data);
  const rows = buildInterviewRows(interviews, applications, candidates, jobs);

  return (
    <>
      <TitleBar
        title="Interviews"
        description="Coordinate scheduled interviews, pending feedback, and hiring-manager actions."
      />

      <div className="space-y-6">
        <InterviewSummaryCards interviews={interviews} />
        <div className="
          grid gap-6
          xl:grid-cols-[minmax(0,1fr)_360px]
        "
        >
          <InterviewsTable rows={rows} />
          <aside className="space-y-6">
            <ScheduleInterviewForm
              applications={applications.map(application => ({
                candidateName: candidates.find(candidate => candidate.id === application.candidateId)?.name ?? 'Unknown candidate',
                id: application.id,
                jobTitle: jobs.find(job => job.id === application.jobId)?.title ?? 'Unknown job',
              }))}
            />
            <InterviewSchedulePreview rows={rows} />
          </aside>
        </div>
      </div>
    </>
  );
}
