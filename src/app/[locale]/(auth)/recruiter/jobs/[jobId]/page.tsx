import { TitleBar } from '@/features/dashboard/TitleBar';
import { AddCandidateToJobForm } from '@/features/recruitment/applications/components/AddCandidateToJobForm';
import {
  getJobDbDataById,
  mapDbApplicationsToUiApplications,
  mapDbCandidatesToUiCandidates,
  mapDbJobsToUiJobs,
} from '@/features/recruitment/db-view-models';

type RecruiterJobDetailPageProps = {
  params: Promise<{ jobId: string }>;
};

export default async function RecruiterJobDetailPage(props: RecruiterJobDetailPageProps) {
  const { jobId } = await props.params;
  const data = await getJobDbDataById(jobId);

  if (!data) {
    return (
      <>
        <TitleBar title="Job Not Found" description="The requested job was not found." />
        <section className="
          rounded-lg border bg-card p-6 text-sm text-muted-foreground
        "
        >
          Return to jobs and select an available role.
        </section>
      </>
    );
  }

  const [job] = mapDbJobsToUiJobs({ ...data, jobs: [data.job] });
  const candidates = mapDbCandidatesToUiCandidates(data);
  const applications = mapDbApplicationsToUiApplications(data);

  return (
    <>
      <TitleBar title={job?.title ?? data.job.title} description="Review job setup, applications, and candidate matching context." />
      <div className="
        grid gap-6
        xl:grid-cols-[minmax(0,1fr)_360px]
      "
      >
        <div className="space-y-6">
          <section className="rounded-lg border bg-card p-4">
            <h2 className="text-base font-semibold text-foreground">Role Brief</h2>
            <p className="mt-3 text-sm/6 text-muted-foreground">{data.job.description}</p>
            <p className="mt-3 text-sm/6 text-muted-foreground">{data.job.responsibilities}</p>
          </section>
          <section className="rounded-lg border bg-card p-4">
            <h2 className="text-base font-semibold text-foreground">Applications</h2>
            <div className="mt-3 space-y-3">
              {applications.filter(application => application.jobId === data.job.id).length === 0
                ? <div className="text-sm text-muted-foreground">No applications for this job yet.</div>
                : applications.filter(application => application.jobId === data.job.id).map((application) => {
                    const candidate = candidates.find(item => item.id === application.candidateId);

                    return (
                      <div
                        key={application.id}
                        className="rounded-md border bg-secondary p-3 text-sm"
                      >
                        <div className="font-semibold text-foreground">{candidate?.name ?? 'Unknown candidate'}</div>
                        <div className="text-muted-foreground">{application.currentStage.replaceAll('_', ' ')}</div>
                      </div>
                    );
                  })}
            </div>
          </section>
        </div>
        <aside className="space-y-6">
          <section className="rounded-lg border bg-card p-4">
            <h2 className="text-base font-semibold text-foreground">Criteria</h2>
            <div className="mt-3 text-sm text-muted-foreground">
              {data.job.experienceMin}
              -
              {data.job.experienceMax}
              {' years · CTC '}
              {data.job.salaryMin}
              -
              {data.job.salaryMax}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {data.job.requiredSkills.map(skill => (
                <span
                  key={skill}
                  className="rounded-md border bg-secondary px-2 py-1 text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
          <AddCandidateToJobForm
            candidates={candidates.filter(candidate =>
              !applications.some(application => application.candidateId === candidate.id && application.jobId === data.job.id),
            ).map(candidate => ({ id: candidate.id, name: candidate.name }))}
            jobId={data.job.id}
          />
        </aside>
      </div>
    </>
  );
}
