import type { Application, Candidate, Interview, Job, ScreeningSession } from '../../types';
import { formatDateTime, formatStatus } from '../utils';
import { CandidateSourceBadge } from './CandidateSourceBadge';
import { CandidateStatusBadge } from './CandidateStatusBadge';

const DetailItem = (props: {
  label: string;
  value: React.ReactNode;
}) => (
  <div>
    <div className="text-xs font-semibold text-muted-foreground uppercase">
      {props.label}
    </div>
    <div className="mt-1 text-sm font-medium text-foreground">
      {props.value}
    </div>
  </div>
);

export const CandidateProfileCard = (props: {
  application?: Application;
  candidate: Candidate;
  interview?: Interview;
  job?: Job;
  screeningSession?: ScreeningSession;
}) => (
  <section className="rounded-lg border bg-card">
    <div className="
      flex flex-col gap-4 border-b p-4
      md:flex-row md:items-start md:justify-between
    "
    >
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          {props.candidate.name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {props.candidate.currentRole}
          {' at '}
          {props.candidate.currentCompany}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <CandidateSourceBadge source={props.candidate.source} />
        <CandidateStatusBadge status={props.candidate.status} />
      </div>
    </div>

    <div className="
      grid gap-4 p-4
      sm:grid-cols-2
      xl:grid-cols-3
    "
    >
      <DetailItem label="Email" value={props.candidate.email} />
      <DetailItem label="Phone" value={props.candidate.phone} />
      <DetailItem label="Location" value={props.candidate.location} />
      <DetailItem label="Experience" value={`${props.candidate.experienceYears} years`} />
      <DetailItem label="Expected salary" value={props.candidate.expectedSalary} />
      <DetailItem label="Notice period" value={props.candidate.noticePeriod} />
      <DetailItem label="Applied job" value={props.job?.title ?? 'Unknown job'} />
      <DetailItem
        label="Application stage"
        value={props.application ? formatStatus(props.application.currentStage) : 'No application'}
      />
      <DetailItem
        label="Application status"
        value={props.application ? formatStatus(props.application.status) : 'No status'}
      />
      <DetailItem
        label="Screening"
        value={props.screeningSession ? formatStatus(props.screeningSession.status) : 'Not started'}
      />
      <DetailItem
        label="Interview"
        value={props.interview ? formatStatus(props.interview.status) : 'Not scheduled'}
      />
      <DetailItem
        label="Latest activity"
        value={formatDateTime(props.application?.updatedAt ?? props.candidate.createdAt)}
      />
    </div>
  </section>
);
