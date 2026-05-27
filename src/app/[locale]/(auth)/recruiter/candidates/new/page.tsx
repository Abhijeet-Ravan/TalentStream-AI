import { TitleBar } from '@/features/dashboard/TitleBar';
import { CandidateForm } from '@/features/recruitment/candidates/components/CandidateForm';

export default function NewRecruiterCandidatePage() {
  return (
    <>
      <TitleBar
        title="Add Candidate"
        description="Create a candidate profile and source context for recruiter review."
      />
      <CandidateForm />
    </>
  );
}
