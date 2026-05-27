import { z } from 'zod';

export const createApplicationSchema = z.object({
  candidateId: z.string().uuid(),
  currentStage: z.enum([
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
  ]).default('sourced'),
  jobId: z.string().uuid(),
  status: z.enum([
    'active',
    'on_hold',
    'offer',
    'hired',
    'rejected',
    'withdrawn',
  ]).default('active'),
});

export const updateApplicationStageSchema = z.object({
  applicationId: z.string().uuid(),
  stage: z.enum([
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
  ]),
});

export const updateApplicationStatusSchema = z.object({
  applicationId: z.string().uuid(),
  status: z.enum([
    'active',
    'on_hold',
    'offer',
    'hired',
    'rejected',
    'withdrawn',
  ]),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationStageInput = z.infer<typeof updateApplicationStageSchema>;
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;
