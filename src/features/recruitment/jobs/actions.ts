'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '@/libs/DB';
import { jobsSchema } from '@/models/Schema';
import { createAuditLog } from '../audit/audit-log';
import { getRecruitmentContext } from '../server-context';
import { jobFormSchema } from './validations';

const createJobSchema = jobFormSchema.extend({
  openPositions: z.number().int().positive().default(1),
  status: z.enum(['draft', 'open', 'paused', 'closed']).default('draft'),
});

const updateJobStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['draft', 'open', 'paused', 'closed']),
});

export const createJob = async (input: unknown) => {
  const { organizationId, userId } = await getRecruitmentContext();
  const payload = createJobSchema.parse(input);

  const [job] = await db
    .insert(jobsSchema)
    .values({
      ...payload,
      avoidIndustries: payload.avoidIndustries ?? [],
      createdById: userId,
      organizationId,
    })
    .returning();

  if (!job) {
    throw new Error('Failed to create job.');
  }

  await createAuditLog({
    action: 'job_created',
    actorId: userId,
    entityId: job.id,
    entityType: 'job',
    metadata: { title: job.title },
    organizationId,
  });

  revalidatePath('/recruiter/jobs');

  return job;
};

export const updateJobStatus = async (id: string, status: unknown) => {
  const { organizationId } = await getRecruitmentContext();
  const payload = updateJobStatusSchema.parse({ id, status });

  const [job] = await db
    .update(jobsSchema)
    .set({ status: payload.status })
    .where(and(
      eq(jobsSchema.id, payload.id),
      eq(jobsSchema.organizationId, organizationId),
    ))
    .returning();

  if (!job) {
    throw new Error('Job not found.');
  }

  return job;
};
