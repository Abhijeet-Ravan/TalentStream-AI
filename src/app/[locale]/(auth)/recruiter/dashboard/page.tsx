import { RecruiterDashboardContent } from '@/features/recruitment/dashboard/components/RecruiterDashboardContent';
import {
  getDbRecruiterAlerts,
  getDbRecruiterMetrics,
  getRecruitmentDbData,
  mapDbApplicationsToUiApplications,
  mapDbCandidatesToUiCandidates,
  mapDbInterviewsToUiInterviews,
  mapDbJobsToUiJobs,
  mapDbScreeningsToUiScreenings,
} from '@/features/recruitment/db-view-models';

export default async function RecruiterDashboardPage() {
  const data = await getRecruitmentDbData();

  return (
    <RecruiterDashboardContent
      applications={mapDbApplicationsToUiApplications(data)}
      candidates={mapDbCandidatesToUiCandidates(data)}
      interviews={mapDbInterviewsToUiInterviews(data)}
      jobs={mapDbJobsToUiJobs(data)}
      recruiterAlerts={getDbRecruiterAlerts()}
      recruiterMetrics={getDbRecruiterMetrics(data)}
      screeningSessions={mapDbScreeningsToUiScreenings(data)}
    />
  );
}
