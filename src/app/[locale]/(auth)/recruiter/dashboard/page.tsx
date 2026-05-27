import { RecruiterDashboardContent } from '@/features/recruitment/dashboard/components/RecruiterDashboardContent';
import {
  applications,
  candidates,
  interviews,
  jobs,
  recruiterAlerts,
  recruiterMetrics,
  screeningSessions,
} from '@/features/recruitment/mock-data';

export default function RecruiterDashboardPage() {
  return (
    <RecruiterDashboardContent
      applications={applications}
      candidates={candidates}
      interviews={interviews}
      jobs={jobs}
      recruiterAlerts={recruiterAlerts}
      recruiterMetrics={recruiterMetrics}
      screeningSessions={screeningSessions}
    />
  );
}
