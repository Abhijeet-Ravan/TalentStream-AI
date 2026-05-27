import { TitleBar } from '@/features/dashboard/TitleBar';
import { AnalyticsMetricCard } from '@/features/recruitment/analytics/components/AnalyticsMetricCard';
import { HiringVelocityPanel } from '@/features/recruitment/analytics/components/HiringVelocityPanel';
import { PipelineFunnel } from '@/features/recruitment/analytics/components/PipelineFunnel';
import { ScreeningPerformancePanel } from '@/features/recruitment/analytics/components/ScreeningPerformancePanel';
import { SourceBreakdown } from '@/features/recruitment/analytics/components/SourceBreakdown';
import { getAnalyticsMetrics } from '@/features/recruitment/analytics/utils';
import {
  getRecruitmentDbData,
  mapDbApplicationsToUiApplications,
  mapDbCandidatesToUiCandidates,
  mapDbInterviewsToUiInterviews,
  mapDbJobsToUiJobs,
  mapDbScreeningsToUiScreenings,
} from '@/features/recruitment/db-view-models';

export default async function RecruiterAnalyticsPage() {
  const data = await getRecruitmentDbData();
  const applications = mapDbApplicationsToUiApplications(data);
  const candidates = mapDbCandidatesToUiCandidates(data);
  const interviews = mapDbInterviewsToUiInterviews(data);
  const jobs = mapDbJobsToUiJobs(data);
  const screeningSessions = mapDbScreeningsToUiScreenings(data);
  const metrics = getAnalyticsMetrics(jobs, candidates, screeningSessions, interviews);

  return (
    <>
      <TitleBar
        title="Analytics"
        description="Monitor hiring funnel health, source quality, screening throughput, and recruiter workload."
      />

      <div className="space-y-6">
        <div className="
          grid gap-4
          sm:grid-cols-2
          xl:grid-cols-5
        "
        >
          {metrics.map(metric => (
            <AnalyticsMetricCard
              key={metric.id}
              description={metric.description}
              label={metric.label}
              suffix={metric.suffix}
              value={metric.value}
            />
          ))}
        </div>

        <div className="
          grid gap-6
          xl:grid-cols-2
        "
        >
          <PipelineFunnel applications={applications} />
          <SourceBreakdown candidates={candidates} />
          <HiringVelocityPanel applications={applications} jobs={jobs} />
          <ScreeningPerformancePanel screenings={screeningSessions} />
        </div>
      </div>
    </>
  );
}
