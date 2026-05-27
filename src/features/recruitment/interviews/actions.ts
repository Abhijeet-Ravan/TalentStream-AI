'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '@/libs/DB';
import {
  applicationsSchema,
  interviewFeedbackSchema,
  interviewsSchema,
} from '@/models/Schema';
import { createAuditLog } from '../audit/audit-log';
import { createNotificationRecordForOrg } from '../notifications/record-notification';
import { getRecruitmentContext } from '../server-context';
import {
  scheduleInterviewSchema,
} from './validations';

const createInterviewFeedbackSchema = z.object({
  applicationId: z.string().uuid(),
  communication: z.number().int().min(1).max(5).optional(),
  concerns: z.string().trim().optional(),
  cultureFit: z.number().int().min(1).max(5).optional(),
  domainFit: z.number().int().min(1).max(5).optional(),
  interviewId: z.string().uuid(),
  nextRoundRecommendation: z.string().trim().optional(),
  overallRecommendation: z.string().trim().min(1),
  reviewerId: z.string().trim().min(1),
  reviewerName: z.string().trim().min(1),
  strengths: z.string().trim().optional(),
  submittedAt: z.coerce.date().optional(),
  technicalCompetency: z.number().int().min(1).max(5).optional(),
});

const assertApplicationExists = async (applicationId: string, organizationId: string) => {
  const [application] = await db
    .select({ id: applicationsSchema.id })
    .from(applicationsSchema)
    .where(and(
      eq(applicationsSchema.id, applicationId),
      eq(applicationsSchema.organizationId, organizationId),
    ));

  if (!application) {
    throw new Error('Application not found.');
  }
};

export const scheduleMockInterview = async (input: unknown) => {
  const { organizationId, userId } = await getRecruitmentContext();
  const payload = scheduleInterviewSchema.parse(input);
  await assertApplicationExists(payload.applicationId, organizationId);

  const [interview] = await db
    .insert(interviewsSchema)
    .values({
      ...payload,
      organizationId,
      status: 'scheduled',
    })
    .returning();

  if (!interview) {
    throw new Error('Failed to schedule interview.');
  }

  await createAuditLog({
    action: 'interview_scheduled',
    actorId: userId,
    entityId: interview.id,
    entityType: 'interview',
    metadata: { applicationId: interview.applicationId },
    organizationId,
  });

  await db
    .update(applicationsSchema)
    .set({ currentStage: 'interview_scheduled_round_1' })
    .where(eq(applicationsSchema.id, interview.applicationId));
  await createNotificationRecordForOrg({
    channel: 'internal',
    eventType: 'interview_scheduled',
    organizationId,
    payload: { applicationId: interview.applicationId, interviewId: interview.id },
    recipientId: interview.id,
    recipientType: 'interview',
    status: 'mock_created',
  });
  revalidatePath('/recruiter/interviews');
  revalidatePath('/recruiter/pipeline');

  return interview;
};

// const updateInterviewStatus = async (interviewId: string, status: unknown) => {
//   const { organizationId } = await getRecruitmentContext();
//   const payload = updateInterviewStatusSchema.parse({ interviewId, status });

//   const [interview] = await db
//     .update(interviewsSchema)
//     .set({ status: payload.status })
//     .where(and(
//       eq(interviewsSchema.id, payload.interviewId),
//       eq(interviewsSchema.organizationId, organizationId),
//     ))
//     .returning();

//   if (!interview) {
//     throw new Error('Interview not found.');
//   }

//   return interview;
// };

export const createInterviewFeedback = async (input: unknown) => {
  const { organizationId, userId } = await getRecruitmentContext();
  const payload = createInterviewFeedbackSchema.parse(input);
  await assertApplicationExists(payload.applicationId, organizationId);

  const [interview] = await db
    .select({ id: interviewsSchema.id })
    .from(interviewsSchema)
    .where(and(
      eq(interviewsSchema.id, payload.interviewId),
      eq(interviewsSchema.organizationId, organizationId),
    ));

  if (!interview) {
    throw new Error('Interview not found.');
  }

  const [feedback] = await db
    .insert(interviewFeedbackSchema)
    .values({
      ...payload,
      organizationId,
    })
    .returning();

  if (!feedback) {
    throw new Error('Failed to create interview feedback.');
  }

  await createAuditLog({
    action: 'interview_feedback_submitted',
    actorId: userId,
    entityId: feedback.id,
    entityType: 'interview_feedback',
    metadata: {
      applicationId: feedback.applicationId,
      interviewId: feedback.interviewId,
      overallRecommendation: feedback.overallRecommendation,
    },
    organizationId,
  });

  const nextStage = feedback.nextRoundRecommendation === 'reject'
    ? 'rejected'
    : feedback.nextRoundRecommendation === 'hold'
      ? 'on_hold'
      : 'awaiting_feedback';

  await db
    .update(interviewsSchema)
    .set({ status: 'completed' })
    .where(eq(interviewsSchema.id, feedback.interviewId));
  await db
    .update(applicationsSchema)
    .set({ currentStage: nextStage })
    .where(eq(applicationsSchema.id, feedback.applicationId));
  await createNotificationRecordForOrg({
    channel: 'internal',
    eventType: 'interview_feedback_submitted',
    organizationId,
    payload: {
      applicationId: feedback.applicationId,
      interviewId: feedback.interviewId,
      recommendation: feedback.overallRecommendation,
    },
    recipientId: feedback.applicationId,
    recipientType: 'application',
    status: 'mock_created',
  });
  revalidatePath('/recruiter/interviews');
  revalidatePath('/recruiter/pipeline');

  return feedback;
};

// export const submitInterviewFeedback = async (input: unknown) => {
//   const { organizationId, userId } = await getRecruitmentContext();
//   const payload = createInterviewFeedbackSchema.parse(input);
//   await assertApplicationExists(payload.applicationId, organizationId);

//   const [interview] = await db
//     .select({ id: interviewsSchema.id })
//     .from(interviewsSchema)
//     .where(and(
//       eq(interviewsSchema.id, payload.interviewId),
//       eq(interviewsSchema.organizationId, organizationId),
//     ));

//   if (!interview) {
//     throw new Error('Interview not found.');
//   }

//   const [feedback] = await db
//     .insert(interviewFeedbackSchema)
//     .values({
//       ...payload,
//       organizationId,
//     })
//     .returning();

//   if (!feedback) {
//     throw new Error('Failed to create interview feedback.');
//   }

//   await createAuditLog({
//     action: 'interview_feedback_submitted',
//     actorId: userId,
//     entityId: feedback.id,
//     entityType: 'interview_feedback',
//     metadata: {
//       applicationId: feedback.applicationId,
//       interviewId: feedback.interviewId,
//       overallRecommendation: feedback.overallRecommendation,
//     },
//     organizationId,
//   });

//   const nextStage = feedback.nextRoundRecommendation === 'reject'
//     ? 'rejected'
//     : feedback.nextRoundRecommendation === 'hold'
//       ? 'on_hold'
//       : 'awaiting_feedback';

//   await db
//     .update(interviewsSchema)
//     .set({ status: 'completed' })
//     .where(eq(interviewsSchema.id, feedback.interviewId));
//   await db
//     .update(applicationsSchema)
//     .set({ currentStage: nextStage })
//     .where(eq(applicationsSchema.id, feedback.applicationId));
//   await createNotificationRecordForOrg({
//     channel: 'internal',
//     eventType: 'interview_feedback_submitted',
//     organizationId,
//     payload: {
//       applicationId: feedback.applicationId,
//       interviewId: feedback.interviewId,
//       recommendation: feedback.overallRecommendation,
//     },
//     recipientId: feedback.applicationId,
//     recipientType: 'application',
//     status: 'mock_created',
//   });
//   revalidatePath('/recruiter/interviews');
//   revalidatePath('/recruiter/pipeline');

//   return feedback;
// };

export { createInterviewFeedback as submitInterviewFeedback };
