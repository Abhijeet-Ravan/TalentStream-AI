'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '@/libs/DB';
import {
  applicationsSchema,
  candidatesSchema,
  jobsSchema,
  matchScoresSchema,
} from '@/models/Schema';
import { createAuditLog } from '../audit/audit-log';
import { createNotificationRecordForOrg } from '../notifications/record-notification';
import { calculateMockMatchScore } from '../scoring/scoring-service';
import { getRecruitmentContext } from '../server-context';
import {
  createApplicationSchema,
  updateApplicationStageSchema,
  updateApplicationStatusSchema,
} from './validations';

const getScopedJobAndCandidate = async (
  organizationId: string,
  jobId: string,
  candidateId: string,
) => {
  const [job] = await db
    .select()
    .from(jobsSchema)
    .where(and(
      eq(jobsSchema.id, jobId),
      eq(jobsSchema.organizationId, organizationId),
    ));
  const [candidate] = await db
    .select()
    .from(candidatesSchema)
    .where(and(
      eq(candidatesSchema.id, candidateId),
      eq(candidatesSchema.organizationId, organizationId),
    ));

  if (!job || !candidate) {
    throw new Error('Job or candidate not found for this organization.');
  }

  return { candidate, job };
};

export const createApplication = async (input: unknown) => {
  const { organizationId, userId } = await getRecruitmentContext();
  const payload = createApplicationSchema.parse(input);
  const { candidate, job } = await getScopedJobAndCandidate(organizationId, payload.jobId, payload.candidateId);
  const [existingApplication] = await db
    .select({ id: applicationsSchema.id })
    .from(applicationsSchema)
    .where(and(
      eq(applicationsSchema.organizationId, organizationId),
      eq(applicationsSchema.jobId, payload.jobId),
      eq(applicationsSchema.candidateId, payload.candidateId),
    ));

  if (existingApplication) {
    throw new Error('This candidate is already linked to this job.');
  }

  const score = calculateMockMatchScore(job, candidate);

  const [application] = await db
    .insert(applicationsSchema)
    .values({
      ...payload,
      currentStage: score.score >= 80 ? 'ai_recommended' : 'sourced',
      organizationId,
    })
    .returning();

  if (!application) {
    throw new Error('Failed to create application.');
  }

  await createAuditLog({
    action: 'application_created',
    actorId: userId,
    entityId: application.id,
    entityType: 'application',
    metadata: {
      candidateId: application.candidateId,
      jobId: application.jobId,
    },
    organizationId,
  });

  const [matchScore] = await db
    .insert(matchScoresSchema)
    .values({
      applicationId: application.id,
      confidence: score.confidence,
      evidenceSnippets: score.evidenceSnippets,
      explanation: score.explanation,
      featureScores: score.featureScores,
      industryFit: score.industryFit,
      negativeSignals: score.negativeSignals,
      organizationId,
      rubricVersion: score.rubricVersion,
      score: score.score,
      scoreBreakdown: score.scoreBreakdown,
      skillsMatched: score.skillsMatched,
      skillsMissing: score.skillsMissing,
      tenureFit: score.tenureFit,
      tier: score.tier,
    })
    .returning();

  if (matchScore) {
    await createAuditLog({
      action: 'match_score_created',
      actorId: userId,
      entityId: matchScore.id,
      entityType: 'match_score',
      metadata: { applicationId: application.id, score: matchScore.score },
      organizationId,
    });
  }

  revalidatePath('/recruiter/pipeline');

  return application;
};

export const updateApplicationStage = async (applicationId: string, stage: unknown) => {
  const { organizationId, userId } = await getRecruitmentContext();
  const payload = updateApplicationStageSchema.parse({ applicationId, stage });

  const [application] = await db
    .update(applicationsSchema)
    .set({ currentStage: payload.stage })
    .where(and(
      eq(applicationsSchema.id, payload.applicationId),
      eq(applicationsSchema.organizationId, organizationId),
    ))
    .returning();

  if (!application) {
    throw new Error('Application not found.');
  }

  await createAuditLog({
    action: 'application_stage_updated',
    actorId: userId,
    entityId: application.id,
    entityType: 'application',
    metadata: { stage: application.currentStage },
    organizationId,
  });

  revalidatePath('/recruiter/pipeline');

  return application;
};

export const updateApplicationStatus = async (applicationId: string, status: unknown) => {
  const { organizationId } = await getRecruitmentContext();
  const payload = updateApplicationStatusSchema.parse({ applicationId, status });

  const [application] = await db
    .update(applicationsSchema)
    .set({ status: payload.status })
    .where(and(
      eq(applicationsSchema.id, payload.applicationId),
      eq(applicationsSchema.organizationId, organizationId),
    ))
    .returning();

  if (!application) {
    throw new Error('Application not found.');
  }

  return application;
};

export const approveForScreening = async (applicationId: string) => {
  const application = await updateApplicationStage(applicationId, 'approved_for_screening');
  const { organizationId, userId } = await getRecruitmentContext();

  await createNotificationRecordForOrg({
    channel: 'internal',
    eventType: 'screening_approved',
    organizationId,
    payload: { applicationId },
    recipientId: application.candidateId,
    recipientType: 'candidate',
    status: 'mock_created',
  });

  await createAuditLog({
    action: 'application_approved_for_screening',
    actorId: userId,
    entityId: application.id,
    entityType: 'application',
    metadata: { stage: application.currentStage },
    organizationId,
  });

  return application;
};
