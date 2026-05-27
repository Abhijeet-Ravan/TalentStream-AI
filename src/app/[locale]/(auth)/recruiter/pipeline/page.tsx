import { TitleBar } from '@/features/dashboard/TitleBar';
import {
  getRecruitmentDbData,
  mapDbApplicationsToUiApplications,
  mapDbCandidatesToUiCandidates,
  mapDbJobsToUiJobs,
} from '@/features/recruitment/db-view-models';
import { PipelineBoard } from '@/features/recruitment/pipeline/components/PipelineBoard';
import { PipelineSummaryCards } from '@/features/recruitment/pipeline/components/PipelineSummaryCards';
import { buildPipelineCards } from '@/features/recruitment/pipeline/utils';

export default async function RecruiterPipelinePage() {
  const data = await getRecruitmentDbData();
  const applications = mapDbApplicationsToUiApplications(data);
  const candidates = mapDbCandidatesToUiCandidates(data);
  const jobs = mapDbJobsToUiJobs(data);
  const cards = buildPipelineCards(applications, candidates, jobs);

  return (
    <>
      <TitleBar
        title="Pipeline"
        description="Track candidates across sourcing, screening, shortlist, interview, and final decision stages."
      />

      <div className="space-y-6">
        <PipelineSummaryCards applications={applications} />
        <PipelineBoard cards={cards} />
      </div>
    </>
  );
}
