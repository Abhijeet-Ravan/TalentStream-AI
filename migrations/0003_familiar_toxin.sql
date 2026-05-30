ALTER TABLE "screening_sessions" ALTER COLUMN "provider" SET DEFAULT 'mock';--> statement-breakpoint
ALTER TABLE "screening_sessions" ADD COLUMN "provider_session_id" text;--> statement-breakpoint
ALTER TABLE "screening_sessions" ADD COLUMN "provider_status" text;--> statement-breakpoint
ALTER TABLE "screening_sessions" ADD COLUMN "agent_id" text;--> statement-breakpoint
ALTER TABLE "screening_sessions" ADD COLUMN "from_phone_number" text;--> statement-breakpoint
ALTER TABLE "screening_sessions" ADD COLUMN "to_phone_number" text;--> statement-breakpoint
ALTER TABLE "screening_sessions" ADD COLUMN "cost_total" text;--> statement-breakpoint
ALTER TABLE "screening_sessions" ADD COLUMN "call_latency_ms" integer;--> statement-breakpoint
ALTER TABLE "screening_sessions" ADD COLUMN "raw_provider_payload" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "screening_sessions_provider_session_id_unique" ON "screening_sessions" USING btree ("provider_session_id");