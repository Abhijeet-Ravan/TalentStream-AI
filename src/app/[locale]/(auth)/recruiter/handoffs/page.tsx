import { TitleBar } from '@/features/dashboard/TitleBar';
import { HandoffsTable } from '@/features/recruitment/handoffs/components/HandoffsTable';
import { HandoffSummaryCards } from '@/features/recruitment/handoffs/components/HandoffSummaryCards';
import { getHandoffs } from '@/features/recruitment/handoffs/queries';

export default async function RecruiterHandoffsPage() {
  const data = await getHandoffs();

  return (
    <>
      <TitleBar
        title="Handoffs"
        description="Track mock hiring-manager shares, decisions, and candidate review context."
      />
      <div className="space-y-6">
        <HandoffSummaryCards handoffs={data.handoffs} />
        <HandoffsTable
          applications={data.applications.map(application => ({
            candidateName: data.candidates.find(candidate => candidate.id === application.candidateId)?.name ?? 'Unknown candidate',
            decision: data.decisions.find(decision => decision.applicationId === application.id)?.decision,
            handoffId: data.handoffs.find(handoff => handoff.jobId === application.jobId)?.id ?? '',
            id: application.id,
            jobTitle: data.jobs.find(job => job.id === application.jobId)?.title ?? 'Unknown job',
            stage: application.currentStage,
          }))}
          handoffs={data.handoffs}
        />
      </div>
    </>
  );
}
