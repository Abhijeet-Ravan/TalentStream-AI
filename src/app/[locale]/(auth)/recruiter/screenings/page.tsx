import { TitleBar } from '@/features/dashboard/TitleBar';
import {
  getRecruitmentDbData,
  mapDbApplicationsToUiApplications,
  mapDbCandidatesToUiCandidates,
  mapDbJobsToUiJobs,
  mapDbMatchScoresToUiMatchScores,
  mapDbScreeningsToUiScreenings,
} from '@/features/recruitment/db-view-models';
import { ScreeningQueue } from '@/features/recruitment/screening/components/ScreeningQueue';
import { ScreeningResultCard } from '@/features/recruitment/screening/components/ScreeningResultCard';
import { ScreeningSummaryCards } from '@/features/recruitment/screening/components/ScreeningSummaryCards';
import { buildScreeningRows } from '@/features/recruitment/screening/utils';

export default async function RecruiterScreeningsPage() {
  const data = await getRecruitmentDbData();
  const applications = mapDbApplicationsToUiApplications(data);
  const candidates = mapDbCandidatesToUiCandidates(data);
  const jobs = mapDbJobsToUiJobs(data);
  const matchScores = mapDbMatchScoresToUiMatchScores(data);
  const screeningSessions = mapDbScreeningsToUiScreenings(data);
  const rows = buildScreeningRows(
    screeningSessions,
    applications,
    candidates,
    jobs,
    matchScores,
  );
  const completedRows = rows.filter(
    row => row.session?.status === 'completed',
  );

  return (
    <>
      <TitleBar
        title="AI Screenings"
        description="Review queued, active, and completed AI screening sessions."
      />

      <div className="space-y-6">
        <ScreeningSummaryCards sessions={screeningSessions} />
        <ScreeningQueue rows={rows} />

        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">
            Completed Results
          </h2>
          {completedRows.length === 0
            ? (
                <div className="
                  rounded-lg border bg-card p-6 text-sm text-muted-foreground
                "
                >
                  No completed screening results yet.
                </div>
              )
            : (
                <div className="
                  grid gap-4
                  lg:grid-cols-2
                "
                >

                  {completedRows.map(row => (
                    row.session
                      ? <ScreeningResultCard key={row.session?.id ?? row.application.id} row={row} />
                      : null
                  ))}
                </div>
              )}
        </section>
      </div>
    </>
  );
}
