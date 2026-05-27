'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '@/libs/DB';
import {
  applicationsSchema,
  candidatesSchema,
  consentRecordsSchema,
  screeningSessionsSchema,
} from '@/models/Schema';
import { createAuditLog } from '../audit/audit-log';
import { createNotificationRecordForOrg } from '../notifications/record-notification';
import { getRecruitmentContext } from '../server-context';

const applicationIdSchema = z.string().uuid();

const getScopedApplication = async (applicationId: string, organizationId: string) => {
  const [application] = await db
    .select()
    .from(applicationsSchema)
    .where(and(
      eq(applicationsSchema.id, applicationId),
      eq(applicationsSchema.organizationId, organizationId),
    ));

  if (!application) {
    throw new Error('Application not found.');
  }

  return application;
};

export const queueScreening = async (applicationId: unknown) => {
  const { organizationId, userId } = await getRecruitmentContext();
  const parsedApplicationId = applicationIdSchema.parse(applicationId);
  await getScopedApplication(parsedApplicationId, organizationId);

  const [session] = await db
    .insert(screeningSessionsSchema)
    .values({
      applicationId: parsedApplicationId,
      organizationId,
      provider: 'mock',
      status: 'queued',
    })
    .returning();

  if (!session) {
    throw new Error('Failed to queue screening.');
  }

  await createAuditLog({
    action: 'screening_queued',
    actorId: userId,
    entityId: session.id,
    entityType: 'screening_session',
    metadata: { applicationId: parsedApplicationId },
    organizationId,
  });

  await db
    .update(applicationsSchema)
    .set({ currentStage: 'screening_scheduled' })
    .where(eq(applicationsSchema.id, parsedApplicationId));
  await createNotificationRecordForOrg({
    channel: 'internal',
    eventType: 'screening_queued',
    organizationId,
    payload: { applicationId: parsedApplicationId },
    recipientId: session.id,
    recipientType: 'screening_session',
    status: 'mock_created',
  });
  revalidatePath('/recruiter/screenings');
  revalidatePath('/recruiter/pipeline');

  return session;
};

export const completeMockScreening = async (applicationId: unknown) => {
  const { organizationId, userId } = await getRecruitmentContext();
  const parsedApplicationId = applicationIdSchema.parse(applicationId);
  const application = await getScopedApplication(parsedApplicationId, organizationId);

  const [existingSession] = await db
    .select()
    .from(screeningSessionsSchema)
    .where(and(
      eq(screeningSessionsSchema.applicationId, parsedApplicationId),
      eq(screeningSessionsSchema.organizationId, organizationId),
    ));
  const values = {
    candidateQuestions: [
      'What production metrics have you owned?',
      'What is your current notice period?',
    ],
    consentCapturedAt: new Date(),
    qualificationTag: 'qualified',
    recommendation: 'Proceed after recruiter validation',
    resumeCrossCheck: {
      result: 'mock_match',
      summary: 'Resume claims are consistent with screening responses.',
    },
    score: 82,
    sentiment: 'positive',
    status: 'completed' as const,
    structuredSummary: {
      compensationAligned: true,
      experienceConfirmed: true,
      noticePeriodConfirmed: true,
    },
    summary: 'Mock screening completed. Candidate responses align with role requirements.',
    transcript: 'Mock transcript placeholder for future AI screening integration.',
  };
  const [session] = existingSession
    ? await db
        .update(screeningSessionsSchema)
        .set(values)
        .where(eq(screeningSessionsSchema.id, existingSession.id))
        .returning()
    : await db
        .insert(screeningSessionsSchema)
        .values({
          ...values,
          applicationId: parsedApplicationId,
          organizationId,
          provider: 'mock',
        })
        .returning();

  if (!session) {
    throw new Error('Failed to complete screening.');
  }

  await createAuditLog({
    action: 'screening_completed',
    actorId: userId,
    entityId: session.id,
    entityType: 'screening_session',
    metadata: { applicationId: parsedApplicationId, score: session.score },
    organizationId,
  });

  await db
    .update(applicationsSchema)
    .set({ currentStage: 'screened_awaiting_review' })
    .where(eq(applicationsSchema.id, parsedApplicationId));
  const [candidate] = await db
    .select({ id: candidatesSchema.id })
    .from(candidatesSchema)
    .where(eq(candidatesSchema.id, application.candidateId));

  if (candidate) {
    await db.insert(consentRecordsSchema).values({
      applicationId: parsedApplicationId,
      candidateId: candidate.id,
      channel: 'mock_screening',
      consentType: 'ai_screening_recording',
      evidence: 'Mock consent captured before demo screening completion.',
      metadata: { provider: 'mock' },
      organizationId,
    });
  }

  await createNotificationRecordForOrg({
    channel: 'internal',
    eventType: 'screening_completed',
    organizationId,
    payload: { applicationId: parsedApplicationId, score: session.score },
    recipientId: session.id,
    recipientType: 'screening_session',
    status: 'mock_created',
  });
  revalidatePath('/recruiter/screenings');
  revalidatePath('/recruiter/pipeline');

  return session;
};
