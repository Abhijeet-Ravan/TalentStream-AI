'use server';

import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/libs/DB';
import {
  applicationsSchema,
  candidateAccessLogsSchema,
  candidatesSchema,
  consentRecordsSchema,
} from '@/models/Schema';
import { createAuditLog } from '../audit/audit-log';
import { getRecruitmentContext } from '../server-context';

const createConsentRecordSchema = z.object({
  applicationId: z.string().uuid().optional(),
  candidateId: z.string().uuid(),
  capturedAt: z.coerce.date().optional(),
  channel: z.string().trim().min(1),
  consentType: z.string().trim().min(1),
  evidence: z.string().trim().min(1),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

const createCandidateAccessLogSchema = z.object({
  action: z.string().trim().min(1),
  candidateId: z.string().uuid(),
});

const assertCandidateExists = async (candidateId: string, organizationId: string) => {
  const [candidate] = await db
    .select({ id: candidatesSchema.id })
    .from(candidatesSchema)
    .where(and(
      eq(candidatesSchema.id, candidateId),
      eq(candidatesSchema.organizationId, organizationId),
    ));

  if (!candidate) {
    throw new Error('Candidate not found.');
  }
};

export const createConsentRecord = async (input: unknown) => {
  const { organizationId, userId } = await getRecruitmentContext();
  const payload = createConsentRecordSchema.parse(input);
  await assertCandidateExists(payload.candidateId, organizationId);

  if (payload.applicationId) {
    const [application] = await db
      .select({ id: applicationsSchema.id })
      .from(applicationsSchema)
      .where(and(
        eq(applicationsSchema.id, payload.applicationId),
        eq(applicationsSchema.organizationId, organizationId),
      ));

    if (!application) {
      throw new Error('Application not found.');
    }
  }

  const [record] = await db
    .insert(consentRecordsSchema)
    .values({
      ...payload,
      organizationId,
    })
    .returning();

  if (!record) {
    throw new Error('Failed to create consent record.');
  }

  await createAuditLog({
    action: 'consent.created',
    actorId: userId,
    entityId: record.id,
    entityType: 'consent_record',
    metadata: { candidateId: record.candidateId, consentType: record.consentType },
    organizationId,
  });

  return record;
};

export const createCandidateAccessLog = async (input: unknown) => {
  const { organizationId, userId } = await getRecruitmentContext();
  const payload = createCandidateAccessLogSchema.parse(input);
  await assertCandidateExists(payload.candidateId, organizationId);

  const [record] = await db
    .insert(candidateAccessLogsSchema)
    .values({
      action: payload.action,
      actorId: userId,
      candidateId: payload.candidateId,
      organizationId,
    })
    .returning();

  if (!record) {
    throw new Error('Failed to create candidate access log.');
  }

  await createAuditLog({
    action: 'candidate_access.created',
    actorId: userId,
    entityId: record.id,
    entityType: 'candidate_access_log',
    metadata: { action: record.action, candidateId: record.candidateId },
    organizationId,
  });

  return record;
};
