import { TitleBar } from '@/features/dashboard/TitleBar';
import { JobForm } from '@/features/recruitment/jobs/components/JobForm';

export default function NewRecruiterJobPage() {
  return (
    <>
      <TitleBar
        title="Create Job"
        description="Draft recruiter-authored role setup before candidate matching."
      />

      <JobForm />
    </>
  );
}
