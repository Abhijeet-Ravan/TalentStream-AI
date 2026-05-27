CREATE TYPE "public"."application_status" AS ENUM('active', 'on_hold', 'offer', 'hired', 'rejected', 'withdrawn');--> statement-breakpoint
CREATE TYPE "public"."candidate_source" AS ENUM('employee_referral', 'linkedin', 'naukri', 'career_site', 'agency', 'walk_in', 'campus', 'internal');--> statement-breakpoint
CREATE TYPE "public"."employment_type" AS ENUM('full_time', 'contract', 'consultant');--> statement-breakpoint
CREATE TYPE "public"."interview_status" AS ENUM('unscheduled', 'scheduled', 'completed', 'cancelled', 'feedback_pending');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('draft', 'open', 'paused', 'closed');--> statement-breakpoint
CREATE TYPE "public"."pipeline_stage" AS ENUM('sourced', 'ai_matched', 'screening_pending', 'screened', 'shortlisted', 'interview_scheduled', 'offer_final', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."screening_status" AS ENUM('not_started', 'queued', 'in_progress', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"job_id" uuid NOT NULL,
	"candidate_id" uuid NOT NULL,
	"status" "application_status" DEFAULT 'active' NOT NULL,
	"current_stage" "pipeline_stage" DEFAULT 'sourced' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"actor_id" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"action" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "candidates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"current_role" text NOT NULL,
	"current_company" text NOT NULL,
	"location" text NOT NULL,
	"experience_years" integer NOT NULL,
	"skills" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"source" "candidate_source" NOT NULL,
	"expected_salary" text NOT NULL,
	"notice_period" text NOT NULL,
	"resume_url" text,
	"created_by_id" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"application_id" uuid NOT NULL,
	"interviewer_id" text NOT NULL,
	"interviewer_name" text NOT NULL,
	"scheduled_at" timestamp NOT NULL,
	"status" "interview_status" DEFAULT 'scheduled' NOT NULL,
	"meeting_link" text,
	"notes" text,
	"feedback" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"title" text NOT NULL,
	"department" text NOT NULL,
	"sub_function" text,
	"location" text NOT NULL,
	"employment_type" "employment_type" NOT NULL,
	"status" "job_status" DEFAULT 'draft' NOT NULL,
	"open_positions" integer DEFAULT 1 NOT NULL,
	"experience_min" integer NOT NULL,
	"experience_max" integer NOT NULL,
	"salary_min" integer NOT NULL,
	"salary_max" integer NOT NULL,
	"reporting_manager" text,
	"required_skills" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"preferred_skills" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"preferred_industries" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"avoid_industries" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"education" text,
	"notice_period" text NOT NULL,
	"description" text NOT NULL,
	"responsibilities" text NOT NULL,
	"created_by_id" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "match_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"application_id" uuid NOT NULL,
	"score" integer NOT NULL,
	"skills_matched" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"skills_missing" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"industry_fit" text NOT NULL,
	"tenure_fit" text NOT NULL,
	"explanation" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recruiter_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"candidate_id" uuid NOT NULL,
	"application_id" uuid,
	"author_id" text NOT NULL,
	"note" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "screening_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"application_id" uuid NOT NULL,
	"status" "screening_status" DEFAULT 'queued' NOT NULL,
	"provider" text NOT NULL,
	"external_room_id" text,
	"transcript" text,
	"summary" text,
	"recording_url" text,
	"score" integer,
	"recommendation" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_scores" ADD CONSTRAINT "match_scores_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recruiter_notes" ADD CONSTRAINT "recruiter_notes_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recruiter_notes" ADD CONSTRAINT "recruiter_notes_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "screening_sessions" ADD CONSTRAINT "screening_sessions_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "applications_organization_id_idx" ON "applications" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "applications_job_id_idx" ON "applications" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "applications_candidate_id_idx" ON "applications" USING btree ("candidate_id");--> statement-breakpoint
CREATE INDEX "applications_current_stage_idx" ON "applications" USING btree ("current_stage");--> statement-breakpoint
CREATE INDEX "audit_logs_organization_id_idx" ON "audit_logs" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "audit_logs_entity_idx" ON "audit_logs" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "candidates_organization_id_idx" ON "candidates" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "candidates_email_idx" ON "candidates" USING btree ("email");--> statement-breakpoint
CREATE INDEX "interviews_application_id_idx" ON "interviews" USING btree ("application_id");--> statement-breakpoint
CREATE INDEX "jobs_organization_id_idx" ON "jobs" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "jobs_status_idx" ON "jobs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "match_scores_application_id_idx" ON "match_scores" USING btree ("application_id");--> statement-breakpoint
CREATE INDEX "screening_sessions_application_id_idx" ON "screening_sessions" USING btree ("application_id");