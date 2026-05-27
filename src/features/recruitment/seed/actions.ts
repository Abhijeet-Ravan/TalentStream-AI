'use server';

import { eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import {
  applicationsSchema,
  candidatesSchema,
  hiringManagerHandoffsSchema,
  interviewFeedbackSchema,
  interviewsSchema,
  jobsSchema,
  screeningSessionsSchema,
} from '@/models/Schema';
import { createAuditLog } from '../audit/audit-log';
import { getRecruitmentContext } from '../server-context';
import { seedFromMockData } from './seed-from-mock-data';

const getCount = async (
  table: typeof jobsSchema | typeof candidatesSchema | typeof applicationsSchema
    | typeof screeningSessionsSchema | typeof interviewsSchema
    | typeof hiringManagerHandoffsSchema | typeof interviewFeedbackSchema,
  organizationId: string,
) => {
  const rows = await db
    .select()
    .from(table)
    .where(eq(table.organizationId, organizationId));

  return rows.length;
};

export const getRecruitmentDemoCounts = async () => {
  const { organizationId } = await getRecruitmentContext();

  return {
    applications: await getCount(applicationsSchema, organizationId),
    candidates: await getCount(candidatesSchema, organizationId),
    handoffs: await getCount(hiringManagerHandoffsSchema, organizationId),
    interviewFeedback: await getCount(interviewFeedbackSchema, organizationId),
    interviews: await getCount(interviewsSchema, organizationId),
    jobs: await getCount(jobsSchema, organizationId),
    screeningSessions: await getCount(screeningSessionsSchema, organizationId),
  };
};

export const seedRecruitmentDemoData = async () => {
  const { organizationId, userId } = await getRecruitmentContext();
  const existingJobs = await getCount(jobsSchema, organizationId);

  if (existingJobs > 0) {
    return {
      alreadySeeded: true,
      counts: await getRecruitmentDemoCounts(),
      inserted: {
        applications: 0,
        candidates: 0,
        handoffs: 0,
        interviewFeedback: 0,
        interviews: 0,
        jobs: 0,
        matchScores: 0,
        screeningSessions: 0,
      },
    };
  }

  const inserted = await seedFromMockData({
    createdById: userId,
    organizationId,
  });

  await createAuditLog({
    action: 'demo_data_seeded',
    actorId: userId,
    entityId: organizationId,
    entityType: 'organization',
    metadata: inserted,
    organizationId,
  });

  return {
    alreadySeeded: false,
    counts: await getRecruitmentDemoCounts(),
    inserted,
  };
};
