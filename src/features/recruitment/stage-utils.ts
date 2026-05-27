// src/features/recruitment/stage-utils.ts

import type { PipelineStage } from './types';

export const canonicalPipelineStages = [
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
] as const;

export type CanonicalPipelineStage = typeof canonicalPipelineStages[number];

const legacyStageMap: Partial<Record<PipelineStage, CanonicalPipelineStage>> = {
  ai_matched: 'ai_recommended',
  interview_scheduled: 'interview_scheduled_round_1',
  offer_final: 'offer_stage',
  screened: 'screened_awaiting_review',
  screening_pending: 'screening_scheduled',
  shortlisted: 'shared_with_hiring_manager',
};

export const normalizePipelineStage = (stage: PipelineStage | CanonicalPipelineStage) =>
  legacyStageMap[stage as PipelineStage] ?? stage as CanonicalPipelineStage;

export const pipelineStageLabels: Record<CanonicalPipelineStage, string> = {
  ai_recommended: 'AI Recommended',
  approved_for_screening: 'Approved for Screening',
  awaiting_feedback: 'Awaiting Feedback',
  interview_scheduled_round_1: 'Interview Round 1',
  interview_scheduled_round_2: 'Interview Round 2',
  interview_scheduled_round_3: 'Interview Round 3',
  offer_stage: 'Offer Stage',
  on_hold: 'On Hold',
  rejected: 'Rejected',
  screened_awaiting_review: 'Screened, Awaiting Review',
  screening_scheduled: 'Screening Scheduled',
  shared_with_hiring_manager: 'Shared with Hiring Manager',
  sourced: 'Sourced',
};

export const getNextPipelineStage = (
  stage: PipelineStage | CanonicalPipelineStage,
): CanonicalPipelineStage => {
  const normalizedStage = normalizePipelineStage(stage);
  const currentIndex = canonicalPipelineStages.indexOf(normalizedStage);

  if (currentIndex < 0 || currentIndex >= canonicalPipelineStages.length - 3) {
    return normalizedStage;
  }

  return canonicalPipelineStages[currentIndex + 1] ?? normalizedStage;
};
