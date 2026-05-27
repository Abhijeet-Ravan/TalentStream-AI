// src/features/recruitment/pipeline/utils.ts
import type { Application, Candidate, Job, PipelineStage } from '../types';
import {
  canonicalPipelineStages,
  pipelineStageLabels as importedLabels,
  normalizePipelineStage,
} from '../stage-utils';

type CanonicalPipelineStage = (typeof canonicalPipelineStages)[number];

export const pipelineStageLabels: Record<CanonicalPipelineStage, string> = importedLabels;

export const pipelineStageOrder = canonicalPipelineStages;

export type PipelineCard = {
  application: Application;
  candidate: Candidate;
  job?: Job;
};

export const buildPipelineCards = (
  applications: Application[],
  candidates: Candidate[],
  jobs: Job[],
) => {
  const candidatesById = new Map(
    candidates.map(candidate => [candidate.id, candidate]),
  );

  const jobsById = new Map(
    jobs.map(job => [job.id, job]),
  );

  return applications.flatMap((application) => {
    const candidate = candidatesById.get(application.candidateId);

    if (!candidate) {
      return [];
    }

    return [{
      application: {
        ...application,
        currentStage: normalizePipelineStage(application.currentStage),
      },
      candidate,
      job: jobsById.get(application.jobId),
    }];
  });
};

export const getNextAction = (stage: PipelineStage) => {
  const normalizedStage = normalizePipelineStage(stage);

  const actionMap: Record<CanonicalPipelineStage, string> = {
    sourced: 'Run AI match review',
    ai_recommended: 'Approve for screening',
    approved_for_screening: 'Queue screening',
    screening_scheduled: 'Complete mock screening',
    screened_awaiting_review: 'Review screening result',
    shared_with_hiring_manager: 'Record manager decision',
    interview_scheduled_round_1: 'Complete round 1 feedback',
    interview_scheduled_round_2: 'Complete round 2 feedback',
    interview_scheduled_round_3: 'Complete round 3 feedback',
    awaiting_feedback: 'Collect interview feedback',
    offer_stage: 'Prepare offer decision',
    rejected: 'Archive candidate outcome',
    on_hold: 'Review hold reason',
  };

  return actionMap[normalizedStage] ?? 'Review next action';
};

export const summarizePipeline = (applications: Application[]) =>
  pipelineStageOrder.map(stage => ({
    id: stage,
    label: pipelineStageLabels[stage],
    value: applications.filter(
      application => normalizePipelineStage(application.currentStage) === stage,
    ).length,
  }));
