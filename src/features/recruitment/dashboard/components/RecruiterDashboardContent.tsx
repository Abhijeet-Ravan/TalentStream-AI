import type {
  Application,
  Candidate,
  Interview,
  Job,
  RecruiterAlert,
  RecruiterMetric,
  ScreeningSession,
} from '../../types';

import type { DashboardMetric } from './MetricCard';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { ActiveJobsTable } from './ActiveJobsTable';
import { InterviewSchedulePanel } from './InterviewSchedulePanel';
import { MetricCard } from './MetricCard';
import { PendingActionsPanel } from './PendingActionsPanel';
import { RecommendedCandidateCard } from './RecommendedCandidateCard';
import { RecruitmentAnalyticsPreview } from './RecruitmentAnalyticsPreview';

const metricLabels: Record<string, string> = {
  'metric-active-candidates': 'Active Candidates',
  'metric-interviews': 'Interviews Today',
  'metric-open-jobs': 'Total Open Roles',
  'metric-screenings-due': 'AI Screenings Pending',
};

const getAverageDaysToPipelineMovement = (
  applications: Application[],
  jobs: Job[],
) => {
  if (applications.length === 0) {
    return 0;
  }

  const totalDays = applications.reduce((sum, application) => {
    const job = jobs.find(item => item.id === application.jobId);

    if (!job) {
      return sum;
    }

    const createdAt = new Date(job.createdAt).getTime();
    const updatedAt = new Date(application.updatedAt).getTime();

    return sum + Math.max(updatedAt - createdAt, 0) / 86_400_000;
  }, 0);

  return Math.round(totalDays / applications.length);
};

export const RecruiterDashboardContent = (props: {
  applications: Application[];
  candidates: Candidate[];
  interviews: Interview[];
  jobs: Job[];
  recruiterAlerts: RecruiterAlert[];
  recruiterMetrics: RecruiterMetric[];
  screeningSessions: ScreeningSession[];
}) => {
  const dashboardMetrics: DashboardMetric[] = [
    ...props.recruiterMetrics.map(metric => ({
      ...metric,
      label: metricLabels[metric.id] ?? metric.label,
    })),
    {
      id: 'metric-average-time-to-hire',
      label: 'Average Time to Hire',
      value: getAverageDaysToPipelineMovement(props.applications, props.jobs),
      valueSuffix: 'days',
      changePercent: -8,
      trend: 'down',
      description: 'Average days from job creation to latest candidate pipeline movement.',
    },
  ];

  const recommendedCandidates = [...props.candidates]
    .sort((first, second) => second.matchScore - first.matchScore)
    .slice(0, 4);

  const activeJobs = props.jobs.filter(job => job.status !== 'closed' && job.status !== 'draft');
  const candidatesById = new Map(props.candidates.map(candidate => [candidate.id, candidate]));
  const jobsById = new Map(props.jobs.map(job => [job.id, job]));
  const averageMatchScore = props.candidates.length === 0
    ? 0
    : Math.round(
        props.candidates.reduce((sum, candidate) => sum + candidate.matchScore, 0) / props.candidates.length,
      );

  return (
    <>
      <TitleBar
        title="Recruiter Dashboard"
        description="Track open roles, candidate movement, AI screening, and hiring priorities."
      />

      <div className="space-y-6">
        <div className="
          grid gap-4
          sm:grid-cols-2
          xl:grid-cols-5
        "
        >
          {dashboardMetrics.map(metric => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>

        <div className="
          grid gap-6
          xl:grid-cols-[minmax(0,1fr)_380px]
        "
        >
          <div className="min-w-0 space-y-6">
            <section>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-foreground">
                  Top AI-Recommended Candidates
                </h2>
              </div>

              {recommendedCandidates.length === 0
                ? (
                    <div className="
                      rounded-lg border bg-card p-6 text-sm
                      text-muted-foreground
                    "
                    >
                      No recommended candidates available.
                    </div>
                  )
                : (
                    <div className="
                      grid gap-4
                      lg:grid-cols-2
                    "
                    >
                      {recommendedCandidates.map(candidate => (
                        <RecommendedCandidateCard key={candidate.id} candidate={candidate} />
                      ))}
                    </div>
                  )}
            </section>

            <ActiveJobsTable jobs={activeJobs} />
          </div>

          <aside className="space-y-6">
            <PendingActionsPanel
              alerts={props.recruiterAlerts}
              candidatesById={candidatesById}
              jobsById={jobsById}
            />
            <InterviewSchedulePanel
              interviews={props.interviews}
              candidatesById={candidatesById}
              jobsById={jobsById}
            />
            <RecruitmentAnalyticsPreview
              applications={props.applications}
              averageMatchScore={averageMatchScore}
              interviewCount={props.interviews.length}
              screeningSessions={props.screeningSessions}
            />
          </aside>
        </div>
      </div>
    </>
  );
};
