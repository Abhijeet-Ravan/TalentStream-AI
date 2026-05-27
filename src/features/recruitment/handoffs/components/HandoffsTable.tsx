import { HandoffCandidateCard } from './HandoffCandidateCard';
import { HandoffDecisionPanel } from './HandoffDecisionPanel';

export const HandoffsTable = (props: {
  applications: {
    candidateName: string;
    decision?: string;
    handoffId: string;
    id: string;
    jobTitle: string;
    stage: string;
  }[];
  handoffs: {
    channel: string;
    id: string;
    managerEmail: string;
    managerName: string;
    status: string;
  }[];
}) => (
  <section className="rounded-lg border bg-card">
    <div className="border-b px-4 py-3">
      <h2 className="text-base font-semibold text-foreground">Hiring Manager Handoffs</h2>
    </div>
    <div className="divide-y">
      {props.handoffs.length === 0
        ? (
            <div className="p-6 text-sm text-muted-foreground">
              No handoffs yet. Share candidates with a hiring manager from the workflow.
            </div>
          )
        : props.handoffs.map(handoff => (
            <article key={handoff.id} className="p-4">
              <div className="
                flex flex-col gap-3
                sm:flex-row sm:items-start sm:justify-between
              "
              >
                <div>
                  <div className="text-sm font-semibold text-foreground">{handoff.managerName}</div>
                  <div className="text-xs text-muted-foreground">{handoff.managerEmail}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {handoff.channel}
                    {' · '}
                    {handoff.status.replaceAll('_', ' ')}
                  </div>
                </div>
              </div>
              <div className="
                mt-4 grid gap-3
                lg:grid-cols-2
              "
              >
                {props.applications.filter(application => application.handoffId === handoff.id).map(application => (
                  <div key={application.id} className="space-y-3">
                    <HandoffCandidateCard
                      candidateName={application.candidateName}
                      decision={application.decision}
                      jobTitle={application.jobTitle}
                      stage={application.stage}
                    />
                    <HandoffDecisionPanel applicationId={application.id} handoffId={handoff.id} />
                  </div>
                ))}
              </div>
            </article>
          ))}
    </div>
  </section>
);
