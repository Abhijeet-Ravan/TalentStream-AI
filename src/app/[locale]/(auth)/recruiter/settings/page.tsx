import { TitleBar } from '@/features/dashboard/TitleBar';
import { getRecruitmentDemoCounts } from '@/features/recruitment/seed/actions';
import { DemoDataCard } from '@/features/recruitment/seed/components/DemoDataCard';

export default async function RecruiterSettingsPage() {
  const counts = await getRecruitmentDemoCounts();

  return (
    <>
      <TitleBar
        title="Recruiter Settings"
        description="Manage recruiter workspace preferences and demo data for this organization."
      />
      <DemoDataCard counts={counts} />
    </>
  );
}
