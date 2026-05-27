import type { Application, PipelineStage, ScreeningSession } from '../../types';

const stageLabels: Partial<Record<PipelineStage, string>> = {
  ai_matched: 'AI matched',
  interview_scheduled: 'Interview scheduled',
  offer_final: 'Offer final',
  rejected: 'Rejected',
  screened: 'Screened',
  screening_pending: 'Screening pending',
  shortlisted: 'Shortlisted',
  sourced: 'Sourced',
};

export const RecruitmentAnalyticsPreview = (props: {
  applications: Application[];
  averageMatchScore: number;
  interviewCount: number;
  screeningSessions: ScreeningSession[];
}) => {
  const stageCounts = props.applications.reduce<Record<string, number>>((accumulator, application) => {
    accumulator[application.currentStage] = (accumulator[application.currentStage] ?? 0) + 1;
    return accumulator;
  }, {});

  const completedScreenings = props.screeningSessions.filter(
    screening => screening.status === 'completed',
  ).length;
  const maxStageCount = Math.max(...Object.values(stageCounts), 1);

  return (
    <section className="rounded-lg border bg-card">
      <div className="border-b px-4 py-3">
        <h2 className="text-base font-semibold text-foreground">
          Analytics Preview
        </h2>
      </div>

      <div className="space-y-5 p-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-md border bg-secondary p-3">
            <div className="text-xs font-semibold text-muted-foreground">Avg match</div>
            <div className="mt-1 text-xl font-semibold">
              {props.averageMatchScore}
              %
            </div>
          </div>
          <div className="rounded-md border bg-secondary p-3">
            <div className="text-xs font-semibold text-muted-foreground">Screened</div>
            <div className="mt-1 text-xl font-semibold">{completedScreenings}</div>
          </div>
          <div className="rounded-md border bg-secondary p-3">
            <div className="text-xs font-semibold text-muted-foreground">Interviews</div>
            <div className="mt-1 text-xl font-semibold">{props.interviewCount}</div>
          </div>
        </div>

        <div>
          <div className="mb-3 text-sm font-semibold text-foreground">
            Applications by stage
          </div>

          {props.applications.length === 0
            ? (
                <div className="text-sm text-muted-foreground">
                  No applications to analyze yet.
                </div>
              )
            : (
                <div className="space-y-3">
                  {Object.entries(stageCounts).map(([stage, count]) => (
                    <div key={stage}>
                      <div className="
                        mb-1 flex items-center justify-between gap-3 text-xs
                        font-semibold
                      "
                      >
                        <span className="text-muted-foreground">
                          {stageLabels[stage as PipelineStage] ?? stage.replaceAll('_', ' ')}
                        </span>
                        <span>{count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${Math.max((count / maxStageCount) * 100, 8)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
        </div>
      </div>
    </section>
  );
};
