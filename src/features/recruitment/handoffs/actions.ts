'use server';

import { and, eq, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '@/libs/DB';
import {
  applicationsSchema,
  hiringManagerDecisionsSchema,
  hiringManagerHandoffsSchema,
  jobsSchema,
} from '@/models/Schema';
import { createAuditLog } from '../audit/audit-log';
import { createNotificationRecordForOrg } from '../notifications/record-notification';
import { getRecruitmentContext } from '../server-context';
import {
  recordMockHiringManagerDecisionSchema,
  shareWithHiringManagerSchema,
} from './validations';

export const shareWithHiringManagerMock = async (input: unknown) => {
  const { organizationId, userId } = await getRecruitmentContext();
  const payload = shareWithHiringManagerSchema.parse(input);
  const applications = await db
    .select()
    .from(applicationsSchema)
    .where(and(
      eq(applicationsSchema.organizationId, organizationId),
      inArray(applicationsSchema.id, payload.applicationIds),
    ));

  if (applications.length !== payload.applicationIds.length) {
    throw new Error('One or more applications were not found.');
  }

  const firstApplication = applications[0];

  if (!firstApplication) {
    throw new Error('No applications selected.');
  }

  const [job] = await db
    .select({ id: jobsSchema.id })
    .from(jobsSchema)
    .where(and(
      eq(jobsSchema.id, firstApplication.jobId),
      eq(jobsSchema.organizationId, organizationId),
    ));

  if (!job) {
    throw new Error('Job not found.');
  }

  const [handoff] = await db
    .insert(hiringManagerHandoffsSchema)
    .values({
      channel: payload.channel,
      contextNote: payload.contextNote,
      createdById: userId,
      jobId: job.id,
      managerEmail: payload.managerEmail,
      managerId: payload.managerId,
      managerName: payload.managerName,
      organizationId,
      sentAt: new Date(),
      status: 'mock_sent',
    })
    .returning();

  if (!handoff) {
    throw new Error('Failed to create handoff.');
  }

  await db
    .update(applicationsSchema)
    .set({ currentStage: 'shared_with_hiring_manager' })
    .where(inArray(applicationsSchema.id, payload.applicationIds));
  await createNotificationRecordForOrg({
    channel: payload.channel,
    eventType: 'hiring_manager_handoff_created',
    organizationId,
    payload: { applicationIds: payload.applicationIds, handoffId: handoff.id },
    recipientId: handoff.managerEmail,
    recipientType: 'hiring_manager',
    status: 'mock_created',
  });
  await createAuditLog({
    action: 'hiring_manager_handoff_created',
    actorId: userId,
    entityId: handoff.id,
    entityType: 'hiring_manager_handoff',
    metadata: { applicationIds: payload.applicationIds },
    organizationId,
  });
  revalidatePath('/recruiter/handoffs');
  revalidatePath('/recruiter/pipeline');

  return handoff;
};

export const recordMockHiringManagerDecision = async (input: unknown) => {
  const { organizationId, userId } = await getRecruitmentContext();
  const payload = recordMockHiringManagerDecisionSchema.parse(input);
  const [handoff] = await db
    .select()
    .from(hiringManagerHandoffsSchema)
    .where(and(
      eq(hiringManagerHandoffsSchema.id, payload.handoffId),
      eq(hiringManagerHandoffsSchema.organizationId, organizationId),
    ));
  const [application] = await db
    .select()
    .from(applicationsSchema)
    .where(and(
      eq(applicationsSchema.id, payload.applicationId),
      eq(applicationsSchema.organizationId, organizationId),
    ));

  if (!handoff || !application) {
    throw new Error('Handoff or application not found.');
  }

  const [decision] = await db
    .insert(hiringManagerDecisionsSchema)
    .values({
      applicationId: payload.applicationId,
      confirmedAt: new Date(),
      decision: payload.decision,
      handoffId: payload.handoffId,
      organizationId,
      parserConfidence: payload.parserConfidence,
      rawResponse: payload.rawResponse,
      reason: payload.reason,
    })
    .returning();

  if (!decision) {
    throw new Error('Failed to record decision.');
  }

  const nextStage = payload.decision === 'approve_round_1'
    ? 'awaiting_feedback'
    : payload.decision === 'hold'
      ? 'on_hold'
      : 'rejected';

  await db
    .update(applicationsSchema)
    .set({ currentStage: nextStage, status: payload.decision === 'reject' ? 'rejected' : application.status })
    .where(eq(applicationsSchema.id, application.id));
  await createNotificationRecordForOrg({
    channel: 'internal',
    eventType: 'hiring_manager_decision_recorded',
    organizationId,
    payload: { applicationId: application.id, decision: payload.decision },
    recipientId: application.id,
    recipientType: 'application',
    status: 'mock_created',
  });
  await createAuditLog({
    action: 'hiring_manager_decision_recorded',
    actorId: userId,
    entityId: decision.id,
    entityType: 'hiring_manager_decision',
    metadata: { applicationId: application.id, decision: payload.decision },
    organizationId,
  });
  revalidatePath('/recruiter/handoffs');
  revalidatePath('/recruiter/pipeline');

  return decision;
};
