'use server';

import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/libs/DB';
import {
  applicationsSchema,
  hiringManagerDecisionsSchema,
  hiringManagerHandoffsSchema,
  jobsSchema,
} from '@/models/Schema';
import { createAuditLog } from '../audit/audit-log';
import { getRecruitmentContext } from '../server-context';

const createHiringManagerHandoffSchema = z.object({
  channel: z.string().trim().min(1),
  contextNote: z.string().trim().optional(),
  jobId: z.string().uuid(),
  managerEmail: z.string().email(),
  managerId: z.string().trim().min(1),
  managerName: z.string().trim().min(1),
  sentAt: z.coerce.date().optional(),
  status: z.string().trim().min(1).default('draft'),
});

const recordHiringManagerDecisionSchema = z.object({
  applicationId: z.string().uuid(),
  confirmedAt: z.coerce.date().optional(),
  decision: z.string().trim().min(1),
  handoffId: z.string().uuid(),
  parserConfidence: z.number().int().min(0).max(100).optional(),
  rawResponse: z.string().trim().optional(),
  reason: z.string().trim().optional(),
});

export const createHiringManagerHandoff = async (input: unknown) => {
  const { organizationId, userId } = await getRecruitmentContext();
  const payload = createHiringManagerHandoffSchema.parse(input);
  const [job] = await db
    .select({ id: jobsSchema.id })
    .from(jobsSchema)
    .where(and(
      eq(jobsSchema.id, payload.jobId),
      eq(jobsSchema.organizationId, organizationId),
    ));

  if (!job) {
    throw new Error('Job not found.');
  }

  const [handoff] = await db
    .insert(hiringManagerHandoffsSchema)
    .values({
      ...payload,
      createdById: userId,
      organizationId,
    })
    .returning();

  if (!handoff) {
    throw new Error('Failed to create hiring manager handoff.');
  }

  await createAuditLog({
    action: 'hiring_manager_handoff.created',
    actorId: userId,
    entityId: handoff.id,
    entityType: 'hiring_manager_handoff',
    metadata: { jobId: handoff.jobId, managerEmail: handoff.managerEmail },
    organizationId,
  });

  return handoff;
};

export const recordHiringManagerDecision = async (input: unknown) => {
  const { organizationId, userId } = await getRecruitmentContext();
  const payload = recordHiringManagerDecisionSchema.parse(input);
  const [handoff] = await db
    .select({ id: hiringManagerHandoffsSchema.id })
    .from(hiringManagerHandoffsSchema)
    .where(and(
      eq(hiringManagerHandoffsSchema.id, payload.handoffId),
      eq(hiringManagerHandoffsSchema.organizationId, organizationId),
    ));
  const [application] = await db
    .select({ id: applicationsSchema.id })
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
      ...payload,
      organizationId,
    })
    .returning();

  if (!decision) {
    throw new Error('Failed to record hiring manager decision.');
  }

  await createAuditLog({
    action: 'hiring_manager_decision.recorded',
    actorId: userId,
    entityId: decision.id,
    entityType: 'hiring_manager_decision',
    metadata: { applicationId: decision.applicationId, decision: decision.decision },
    organizationId,
  });

  return decision;
};
