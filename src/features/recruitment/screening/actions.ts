'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '@/libs/DB';
import {
  applicationsSchema,
  candidatesSchema,
  consentRecordsSchema,
  jobsSchema,
  screeningSessionsSchema,
} from '@/models/Schema';
import { createAuditLog } from '../audit/audit-log';
import { createNotificationRecordForOrg } from '../notifications/record-notification';
import { getRecruitmentContext } from '../server-context';
import { scoreMockTranscriptWithLlm } from './mock-llm-scorer';
import { getMockTranscriptFromExternalApi } from './mock-transcript';

const applicationIdSchema = z.string().uuid();
const normalizeSkillList = (value: unknown) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((skill) => {
      if (typeof skill === 'string') {
        return skill;
      }

      if (
        typeof skill === 'object'
        && skill !== null
        && 'name' in skill
      ) {
        return String((skill as { name: unknown }).name);
      }

      return String(skill);
    })
    .map(skill => skill.trim())
    .filter(Boolean);
};

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

  const [candidate] = await db
    .select()
    .from(candidatesSchema)
    .where(and(
      eq(candidatesSchema.id, application.candidateId),
      eq(candidatesSchema.organizationId, organizationId),
    ));

  const [job] = await db
    .select()
    .from(jobsSchema)
    .where(and(
      eq(jobsSchema.id, application.jobId),
      eq(jobsSchema.organizationId, organizationId),
    ));

  if (!candidate || !job) {
    throw new Error('Candidate or job not found for screening.');
  }

  const [existingSession] = await db
    .select()
    .from(screeningSessionsSchema)
    .where(and(
      eq(screeningSessionsSchema.applicationId, parsedApplicationId),
      eq(screeningSessionsSchema.organizationId, organizationId),
    ));

  const candidateSkills = normalizeSkillList(candidate.skills);
  const requiredSkills = normalizeSkillList(job.requiredSkills);

  const transcriptResult = await getMockTranscriptFromExternalApi({
    candidateName: candidate.name,
    candidateSkills,
    currentCompany: candidate.currentCompany,
    currentRole: candidate.currentRole,
    experienceYears: candidate.experienceYears,
    jobTitle: job.title,
    noticePeriod: candidate.noticePeriod,
    requiredSkills,
  });

  const llmScore = await scoreMockTranscriptWithLlm({
    candidateName: candidate.name,
    candidateSkills,
    experienceYears: candidate.experienceYears,
    jobTitle: job.title,
    noticePeriod: candidate.noticePeriod,
    requiredSkills,
    transcript: transcriptResult.transcript,
  });

  const now = new Date();
  const values = {
    attemptCount: (existingSession?.attemptCount ?? 0) + 1,
    callEndedAt: now,
    callStartedAt: new Date(now.getTime() - 120_000),
    candidateQuestions: llmScore.candidateQuestions,
    consentCapturedAt: now,
    durationSeconds: 120,
    externalRoomId: transcriptResult.externalSessionId,
    provider: transcriptResult.provider,
    qualificationTag: llmScore.qualificationTag,
    recommendation: llmScore.recommendation,
    recordingUrl: transcriptResult.recordingUrl,
    resumeCrossCheck: llmScore.resumeCrossCheck,
    score: llmScore.score,
    sentiment: llmScore.sentiment,
    status: 'completed' as const,
    structuredSummary: llmScore.structuredSummary,
    summary: llmScore.summary,
    transcript: transcriptResult.transcript,
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
    metadata: {
      applicationId: parsedApplicationId,
      provider: transcriptResult.provider,
      score: session.score,
      scoringMode: 'mock_transcript_llm',
    },
    organizationId,
  });

  await db
    .update(applicationsSchema)
    .set({ currentStage: 'screened_awaiting_review' })
    .where(eq(applicationsSchema.id, parsedApplicationId));

  await db.insert(consentRecordsSchema).values({
    applicationId: parsedApplicationId,
    candidateId: candidate.id,
    channel: 'mock_screening',
    consentType: 'ai_screening_recording',
    evidence: 'Mock consent captured before demo screening completion.',
    metadata: {
      provider: transcriptResult.provider,
      scoringMode: 'mock_transcript_llm',
    },
    organizationId,
  });

  await createNotificationRecordForOrg({
    channel: 'internal',
    eventType: 'screening_completed',
    organizationId,
    payload: {
      applicationId: parsedApplicationId,
      provider: transcriptResult.provider,
      score: session.score,
    },
    recipientId: session.id,
    recipientType: 'screening_session',
    status: 'mock_created',
  });

  revalidatePath('/recruiter/screenings');
  revalidatePath('/recruiter/pipeline');

  return session;
};
