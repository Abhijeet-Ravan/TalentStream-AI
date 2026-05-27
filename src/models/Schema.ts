import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

// This file defines the structure of your database tables using the Drizzle ORM.

// To modify the database schema:
// 1. Update this file with your desired changes.
// 2. Generate a new migration by running: `npm run db:generate`

// The generated migration file will reflect your schema changes.
// It automatically run the command `db-server:file`, which apply the migration before Next.js starts in development mode,
// Alternatively, if your database is running, you can run `npm run db:migrate` and there is no need to restart the server.

// Need a database for production? Check out https://get.neon.com/BMFYNtx
// Tested and compatible with SaaS Boilerplate

export const todoSchema = pgTable('todo', {
  id: serial('id').primaryKey(),
  ownerId: text('owner_id').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const jobStatusEnum = pgEnum('job_status', [
  'draft',
  'open',
  'paused',
  'closed',
]);

export const employmentTypeEnum = pgEnum('employment_type', [
  'full_time',
  'contract',
  'consultant',
]);

export const candidateSourceEnum = pgEnum('candidate_source', [
  'employee_referral',
  'linkedin',
  'naukri',
  'career_site',
  'agency',
  'walk_in',
  'campus',
  'internal',
]);

export const applicationStatusEnum = pgEnum('application_status', [
  'active',
  'on_hold',
  'offer',
  'hired',
  'rejected',
  'withdrawn',
]);

export const pipelineStageEnum = pgEnum('pipeline_stage', [
  'sourced',
  'ai_recommended',
  'approved_for_screening',
  'screening_scheduled',
  'screened_awaiting_review',
  'shared_with_hiring_manager',
  'interview_scheduled_round_1',
  'interview_scheduled_round_2',
  'interview_scheduled_round_3',
  'awaiting_feedback',
  'offer_stage',
  'rejected',
  'on_hold',
]);

export const screeningStatusEnum = pgEnum('screening_status', [
  'not_started',
  'queued',
  'in_progress',
  'completed',
  'failed',
]);

export const interviewStatusEnum = pgEnum('interview_status', [
  'unscheduled',
  'scheduled',
  'completed',
  'cancelled',
  'feedback_pending',
]);

export const jobsSchema = pgTable('jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: text('organization_id').notNull(),
  title: text('title').notNull(),
  department: text('department').notNull(),
  subFunction: text('sub_function'),
  location: text('location').notNull(),
  employmentType: employmentTypeEnum('employment_type').notNull(),
  status: jobStatusEnum('status').default('draft').notNull(),
  openPositions: integer('open_positions').default(1).notNull(),
  experienceMin: integer('experience_min').notNull(),
  experienceMax: integer('experience_max').notNull(),
  salaryMin: integer('salary_min').notNull(),
  salaryMax: integer('salary_max').notNull(),
  reportingManager: text('reporting_manager'),
  requiredSkills: jsonb('required_skills').$type<string[]>().default(sql`'[]'::jsonb`).notNull(),
  preferredSkills: jsonb('preferred_skills').$type<string[]>().default(sql`'[]'::jsonb`).notNull(),
  preferredIndustries: jsonb('preferred_industries').$type<string[]>().default(sql`'[]'::jsonb`).notNull(),
  avoidIndustries: jsonb('avoid_industries').$type<string[]>().default(sql`'[]'::jsonb`).notNull(),
  education: text('education'),
  noticePeriod: text('notice_period').notNull(),
  description: text('description').notNull(),
  responsibilities: text('responsibilities').notNull(),
  createdById: text('created_by_id').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}, table => [
  index('jobs_organization_id_idx').on(table.organizationId),
  index('jobs_status_idx').on(table.status),
]);

export const candidatesSchema = pgTable('candidates', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: text('organization_id').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  currentRole: text('current_role').notNull(),
  currentCompany: text('current_company').notNull(),
  location: text('location').notNull(),
  experienceYears: integer('experience_years').notNull(),
  skills: jsonb('skills').$type<{
    name: string;
    years: number;
    level: 'working' | 'proficient' | 'expert';
  }[]>().default(sql`'[]'::jsonb`).notNull(),
  source: candidateSourceEnum('source').notNull(),
  sourceUrl: text('source_url'),
  sourceConfidence: integer('source_confidence'),
  capturedAt: timestamp('captured_at', { mode: 'date' }).defaultNow().notNull(),
  openToWork: boolean('open_to_work').default(false).notNull(),
  recentSignals: jsonb('recent_signals').$type<string[]>().default(sql`'[]'::jsonb`).notNull(),
  sourceMetadata: jsonb('source_metadata')
    .$type<Record<string, unknown>>()
    .default(sql`'{}'::jsonb`)
    .notNull(),
  duplicateOfCandidateId: text('duplicate_of_candidate_id'),
  expectedSalary: text('expected_salary').notNull(),
  noticePeriod: text('notice_period').notNull(),
  resumeUrl: text('resume_url'),
  createdById: text('created_by_id').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}, table => [
  index('candidates_organization_id_idx').on(table.organizationId),
  index('candidates_email_idx').on(table.email),
]);

export const applicationsSchema = pgTable('applications', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: text('organization_id').notNull(),
  jobId: uuid('job_id').notNull().references(() => jobsSchema.id),
  candidateId: uuid('candidate_id').notNull().references(() => candidatesSchema.id),
  status: applicationStatusEnum('status').default('active').notNull(),
  currentStage: pipelineStageEnum('current_stage').default('sourced').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}, table => [
  index('applications_organization_id_idx').on(table.organizationId),
  index('applications_job_id_idx').on(table.jobId),
  index('applications_candidate_id_idx').on(table.candidateId),
  index('applications_current_stage_idx').on(table.currentStage),
]);

export const matchScoresSchema = pgTable('match_scores', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: text('organization_id').notNull(),
  applicationId: uuid('application_id').notNull().references(() => applicationsSchema.id),
  score: integer('score').notNull(),
  tier: text('tier'),
  confidence: integer('confidence'),
  featureScores: jsonb('feature_scores')
    .$type<Record<string, number>>()
    .default(sql`'{}'::jsonb`)
    .notNull(),
  evidenceSnippets: jsonb('evidence_snippets').$type<string[]>().default(sql`'[]'::jsonb`).notNull(),
  negativeSignals: jsonb('negative_signals').$type<string[]>().default(sql`'[]'::jsonb`).notNull(),
  rubricVersion: text('rubric_version'),
  scoreBreakdown: jsonb('score_breakdown')
    .$type<Record<string, unknown>>()
    .default(sql`'{}'::jsonb`)
    .notNull(),
  skillsMatched: jsonb('skills_matched').$type<string[]>().default(sql`'[]'::jsonb`).notNull(),
  skillsMissing: jsonb('skills_missing').$type<string[]>().default(sql`'[]'::jsonb`).notNull(),
  industryFit: text('industry_fit').notNull(),
  tenureFit: text('tenure_fit').notNull(),
  explanation: text('explanation').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}, table => [
  index('match_scores_application_id_idx').on(table.applicationId),
]);

export const screeningSessionsSchema = pgTable('screening_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: text('organization_id').notNull(),
  applicationId: uuid('application_id').notNull().references(() => applicationsSchema.id),
  status: screeningStatusEnum('status').default('queued').notNull(),
  provider: text('provider').notNull(),
  externalRoomId: text('external_room_id'),
  attemptCount: integer('attempt_count').default(0).notNull(),
  lastAttemptAt: timestamp('last_attempt_at', { mode: 'date' }),
  nextAttemptAt: timestamp('next_attempt_at', { mode: 'date' }),
  callbackRequestedAt: timestamp('callback_requested_at', { mode: 'date' }),
  consentCapturedAt: timestamp('consent_captured_at', { mode: 'date' }),
  callStartedAt: timestamp('call_started_at', { mode: 'date' }),
  callEndedAt: timestamp('call_ended_at', { mode: 'date' }),
  durationSeconds: integer('duration_seconds'),
  sentiment: text('sentiment'),
  qualificationTag: text('qualification_tag'),
  structuredSummary: jsonb('structured_summary')
    .$type<Record<string, unknown>>()
    .default(sql`'{}'::jsonb`)
    .notNull(),
  resumeCrossCheck: jsonb('resume_cross_check')
    .$type<Record<string, unknown>>()
    .default(sql`'{}'::jsonb`)
    .notNull(),
  candidateQuestions: jsonb('candidate_questions').$type<string[]>().default(sql`'[]'::jsonb`).notNull(),
  failureReason: text('failure_reason'),
  transcript: text('transcript'),
  summary: text('summary'),
  recordingUrl: text('recording_url'),
  score: integer('score'),
  recommendation: text('recommendation'),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}, table => [
  index('screening_sessions_application_id_idx').on(table.applicationId),
]);

export const interviewsSchema = pgTable('interviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: text('organization_id').notNull(),
  applicationId: uuid('application_id').notNull().references(() => applicationsSchema.id),
  interviewerId: text('interviewer_id').notNull(),
  interviewerName: text('interviewer_name').notNull(),
  scheduledAt: timestamp('scheduled_at', { mode: 'date' }).notNull(),
  status: interviewStatusEnum('status').default('scheduled').notNull(),
  meetingLink: text('meeting_link'),
  notes: text('notes'),
  feedback: text('feedback'),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}, table => [
  index('interviews_application_id_idx').on(table.applicationId),
]);

export const recruiterNotesSchema = pgTable('recruiter_notes', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: text('organization_id').notNull(),
  candidateId: uuid('candidate_id').notNull().references(() => candidatesSchema.id),
  applicationId: uuid('application_id').references(() => applicationsSchema.id),
  authorId: text('author_id').notNull(),
  note: text('note').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const hiringManagerHandoffsSchema = pgTable('hiring_manager_handoffs', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: text('organization_id').notNull(),
  jobId: uuid('job_id').notNull().references(() => jobsSchema.id),
  managerId: text('manager_id').notNull(),
  managerName: text('manager_name').notNull(),
  managerEmail: text('manager_email').notNull(),
  channel: text('channel').notNull(),
  status: text('status').notNull(),
  sentAt: timestamp('sent_at', { mode: 'date' }),
  respondedAt: timestamp('responded_at', { mode: 'date' }),
  contextNote: text('context_note'),
  createdById: text('created_by_id').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}, table => [
  index('hiring_manager_handoffs_organization_id_idx').on(table.organizationId),
  index('hiring_manager_handoffs_job_id_idx').on(table.jobId),
]);

export const hiringManagerDecisionsSchema = pgTable('hiring_manager_decisions', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: text('organization_id').notNull(),
  handoffId: uuid('handoff_id').notNull().references(() => hiringManagerHandoffsSchema.id),
  applicationId: uuid('application_id').notNull().references(() => applicationsSchema.id),
  decision: text('decision').notNull(),
  reason: text('reason'),
  rawResponse: text('raw_response'),
  parserConfidence: integer('parser_confidence'),
  confirmedAt: timestamp('confirmed_at', { mode: 'date' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}, table => [
  index('hiring_manager_decisions_handoff_id_idx').on(table.handoffId),
  index('hiring_manager_decisions_application_id_idx').on(table.applicationId),
]);

export const interviewFeedbackSchema = pgTable('interview_feedback', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: text('organization_id').notNull(),
  interviewId: uuid('interview_id').notNull().references(() => interviewsSchema.id),
  applicationId: uuid('application_id').notNull().references(() => applicationsSchema.id),
  reviewerId: text('reviewer_id').notNull(),
  reviewerName: text('reviewer_name').notNull(),
  overallRecommendation: text('overall_recommendation').notNull(),
  technicalCompetency: integer('technical_competency'),
  domainFit: integer('domain_fit'),
  communication: integer('communication'),
  cultureFit: integer('culture_fit'),
  strengths: text('strengths'),
  concerns: text('concerns'),
  nextRoundRecommendation: text('next_round_recommendation'),
  submittedAt: timestamp('submitted_at', { mode: 'date' }).defaultNow().notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}, table => [
  index('interview_feedback_interview_id_idx').on(table.interviewId),
  index('interview_feedback_application_id_idx').on(table.applicationId),
]);

export const notificationsSchema = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: text('organization_id').notNull(),
  recipientType: text('recipient_type').notNull(),
  recipientId: text('recipient_id').notNull(),
  channel: text('channel').notNull(),
  eventType: text('event_type').notNull(),
  status: text('status').notNull(),
  payload: jsonb('payload').$type<Record<string, unknown>>().default(sql`'{}'::jsonb`).notNull(),
  sentAt: timestamp('sent_at', { mode: 'date' }),
  failedAt: timestamp('failed_at', { mode: 'date' }),
  failureReason: text('failure_reason'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}, table => [
  index('notifications_organization_id_idx').on(table.organizationId),
  index('notifications_recipient_idx').on(table.recipientType, table.recipientId),
]);

export const consentRecordsSchema = pgTable('consent_records', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: text('organization_id').notNull(),
  candidateId: uuid('candidate_id').notNull().references(() => candidatesSchema.id),
  applicationId: uuid('application_id').references(() => applicationsSchema.id),
  consentType: text('consent_type').notNull(),
  channel: text('channel').notNull(),
  capturedAt: timestamp('captured_at', { mode: 'date' }).defaultNow().notNull(),
  evidence: text('evidence').notNull(),
  metadata: jsonb('metadata').$type<Record<string, unknown>>().default(sql`'{}'::jsonb`).notNull(),
}, table => [
  index('consent_records_candidate_id_idx').on(table.candidateId),
  index('consent_records_application_id_idx').on(table.applicationId),
]);

export const communicationSuppressionsSchema = pgTable('communication_suppressions', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: text('organization_id').notNull(),
  candidateId: uuid('candidate_id').references(() => candidatesSchema.id),
  phone: text('phone'),
  email: text('email'),
  reason: text('reason').notNull(),
  suppressedUntil: timestamp('suppressed_until', { mode: 'date' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}, table => [
  index('communication_suppressions_organization_id_idx').on(table.organizationId),
  index('communication_suppressions_candidate_id_idx').on(table.candidateId),
]);

export const candidateAccessLogsSchema = pgTable('candidate_access_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: text('organization_id').notNull(),
  candidateId: uuid('candidate_id').notNull().references(() => candidatesSchema.id),
  actorId: text('actor_id').notNull(),
  action: text('action').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}, table => [
  index('candidate_access_logs_candidate_id_idx').on(table.candidateId),
  index('candidate_access_logs_organization_id_idx').on(table.organizationId),
]);

export const auditLogsSchema = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: text('organization_id').notNull(),
  actorId: text('actor_id').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  action: text('action').notNull(),
  metadata: jsonb('metadata').$type<Record<string, unknown>>().default(sql`'{}'::jsonb`).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}, table => [
  index('audit_logs_organization_id_idx').on(table.organizationId),
  index('audit_logs_entity_idx').on(table.entityType, table.entityId),
]);
