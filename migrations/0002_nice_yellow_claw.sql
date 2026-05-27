CREATE TABLE "candidate_access_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"candidate_id" uuid NOT NULL,
	"actor_id" text NOT NULL,
	"action" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "communication_suppressions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"candidate_id" uuid,
	"phone" text,
	"email" text,
	"reason" text NOT NULL,
	"suppressed_until" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "consent_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"candidate_id" uuid NOT NULL,
	"application_id" uuid,
	"consent_type" text NOT NULL,
	"channel" text NOT NULL,
	"captured_at" timestamp DEFAULT now() NOT NULL,
	"evidence" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hiring_manager_decisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"handoff_id" uuid NOT NULL,
	"application_id" uuid NOT NULL,
	"decision" text NOT NULL,
	"reason" text,
	"raw_response" text,
	"parser_confidence" integer,
	"confirmed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hiring_manager_handoffs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"job_id" uuid NOT NULL,
	"manager_id" text NOT NULL,
	"manager_name" text NOT NULL,
	"manager_email" text NOT NULL,
	"channel" text NOT NULL,
	"status" text NOT NULL,
	"sent_at" timestamp,
	"responded_at" timestamp,
	"context_note" text,
	"created_by_id" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interview_feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"interview_id" uuid NOT NULL,
	"application_id" uuid NOT NULL,
	"reviewer_id" text NOT NULL,
	"reviewer_name" text NOT NULL,
	"overall_recommendation" text NOT NULL,
	"technical_competency" integer,
	"domain_fit" integer,
	"communication" integer,
	"culture_fit" integer,
	"strengths" text,
	"concerns" text,
	"next_round_recommendation" text,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"recipient_type" text NOT NULL,
	"recipient_id" text NOT NULL,
	"channel" text NOT NULL,
	"event_type" text NOT NULL,
	"status" text NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"sent_at" timestamp,
	"failed_at" timestamp,
	"failure_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "current_stage" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "current_stage" SET DEFAULT 'sourced'::text;--> statement-breakpoint
DROP TYPE "public"."pipeline_stage";--> statement-breakpoint
CREATE TYPE "public"."pipeline_stage" AS ENUM('sourced', 'ai_recommended', 'approved_for_screening', 'screening_scheduled', 'screened_awaiting_review', 'shared_with_hiring_manager', 'interview_scheduled_round_1', 'interview_scheduled_round_2', 'interview_scheduled_round_3', 'awaiting_feedback', 'offer_stage', 'rejected', 'on_hold');--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "current_stage" SET DEFAULT 'sourced'::"public"."pipeline_stage";--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "current_stage" SET DATA TYPE "public"."pipeline_stage" USING (
	CASE "current_stage"
		WHEN 'ai_matched' THEN 'ai_recommended'
		WHEN 'screening_pending' THEN 'screening_scheduled'
		WHEN 'screened' THEN 'screened_awaiting_review'
		WHEN 'shortlisted' THEN 'shared_with_hiring_manager'
		WHEN 'interview_scheduled' THEN 'interview_scheduled_round_1'
		WHEN 'offer_final' THEN 'offer_stage'
		ELSE "current_stage"
	END
)::"public"."pipeline_stage";--> statement-breakpoint
ALTER TABLE "candidates" ADD COLUMN "source_url" text;--> statement-breakpoint
ALTER TABLE "candidates" ADD COLUMN "source_confidence" integer;--> statement-breakpoint
ALTER TABLE "candidates" ADD COLUMN "captured_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "candidates" ADD COLUMN "open_to_work" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "candidates" ADD COLUMN "recent_signals" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "candidates" ADD COLUMN "source_metadata" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "candidates" ADD COLUMN "duplicate_of_candidate_id" text;--> statement-breakpoint
ALTER TABLE "match_scores" ADD COLUMN "tier" text;--> statement-breakpoint
ALTER TABLE "match_scores" ADD COLUMN "confidence" integer;--> statement-breakpoint
ALTER TABLE "match_scores" ADD COLUMN "feature_scores" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "match_scores" ADD COLUMN "evidence_snippets" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "match_scores" ADD COLUMN "negative_signals" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "match_scores" ADD COLUMN "rubric_version" text;--> statement-breakpoint
ALTER TABLE "match_scores" ADD COLUMN "score_breakdown" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "screening_sessions" ADD COLUMN "attempt_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "screening_sessions" ADD COLUMN "last_attempt_at" timestamp;--> statement-breakpoint
ALTER TABLE "screening_sessions" ADD COLUMN "next_attempt_at" timestamp;--> statement-breakpoint
ALTER TABLE "screening_sessions" ADD COLUMN "callback_requested_at" timestamp;--> statement-breakpoint
ALTER TABLE "screening_sessions" ADD COLUMN "consent_captured_at" timestamp;--> statement-breakpoint
ALTER TABLE "screening_sessions" ADD COLUMN "call_started_at" timestamp;--> statement-breakpoint
ALTER TABLE "screening_sessions" ADD COLUMN "call_ended_at" timestamp;--> statement-breakpoint
ALTER TABLE "screening_sessions" ADD COLUMN "duration_seconds" integer;--> statement-breakpoint
ALTER TABLE "screening_sessions" ADD COLUMN "sentiment" text;--> statement-breakpoint
ALTER TABLE "screening_sessions" ADD COLUMN "qualification_tag" text;--> statement-breakpoint
ALTER TABLE "screening_sessions" ADD COLUMN "structured_summary" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "screening_sessions" ADD COLUMN "resume_cross_check" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "screening_sessions" ADD COLUMN "candidate_questions" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "screening_sessions" ADD COLUMN "failure_reason" text;--> statement-breakpoint
ALTER TABLE "candidate_access_logs" ADD CONSTRAINT "candidate_access_logs_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "communication_suppressions" ADD CONSTRAINT "communication_suppressions_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consent_records" ADD CONSTRAINT "consent_records_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consent_records" ADD CONSTRAINT "consent_records_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hiring_manager_decisions" ADD CONSTRAINT "hiring_manager_decisions_handoff_id_hiring_manager_handoffs_id_fk" FOREIGN KEY ("handoff_id") REFERENCES "public"."hiring_manager_handoffs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hiring_manager_decisions" ADD CONSTRAINT "hiring_manager_decisions_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hiring_manager_handoffs" ADD CONSTRAINT "hiring_manager_handoffs_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview_feedback" ADD CONSTRAINT "interview_feedback_interview_id_interviews_id_fk" FOREIGN KEY ("interview_id") REFERENCES "public"."interviews"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview_feedback" ADD CONSTRAINT "interview_feedback_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "candidate_access_logs_candidate_id_idx" ON "candidate_access_logs" USING btree ("candidate_id");--> statement-breakpoint
CREATE INDEX "candidate_access_logs_organization_id_idx" ON "candidate_access_logs" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "communication_suppressions_organization_id_idx" ON "communication_suppressions" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "communication_suppressions_candidate_id_idx" ON "communication_suppressions" USING btree ("candidate_id");--> statement-breakpoint
CREATE INDEX "consent_records_candidate_id_idx" ON "consent_records" USING btree ("candidate_id");--> statement-breakpoint
CREATE INDEX "consent_records_application_id_idx" ON "consent_records" USING btree ("application_id");--> statement-breakpoint
CREATE INDEX "hiring_manager_decisions_handoff_id_idx" ON "hiring_manager_decisions" USING btree ("handoff_id");--> statement-breakpoint
CREATE INDEX "hiring_manager_decisions_application_id_idx" ON "hiring_manager_decisions" USING btree ("application_id");--> statement-breakpoint
CREATE INDEX "hiring_manager_handoffs_organization_id_idx" ON "hiring_manager_handoffs" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "hiring_manager_handoffs_job_id_idx" ON "hiring_manager_handoffs" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "interview_feedback_interview_id_idx" ON "interview_feedback" USING btree ("interview_id");--> statement-breakpoint
CREATE INDEX "interview_feedback_application_id_idx" ON "interview_feedback" USING btree ("application_id");--> statement-breakpoint
CREATE INDEX "notifications_organization_id_idx" ON "notifications" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "notifications_recipient_idx" ON "notifications" USING btree ("recipient_type","recipient_id");
