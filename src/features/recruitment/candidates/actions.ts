'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/libs/DB';
import { candidatesSchema } from '@/models/Schema';
import { createAuditLog } from '../audit/audit-log';
import { getRecruitmentContext } from '../server-context';
import { createCandidateSchema } from './validations';

export const createCandidate = async (input: unknown) => {
  const { organizationId, userId } = await getRecruitmentContext();
  const payload = createCandidateSchema.parse(input);

  const [candidate] = await db
    .insert(candidatesSchema)
    .values({
      ...payload,
      createdById: userId,
      organizationId,
    })
    .returning();

  if (!candidate) {
    throw new Error('Failed to create candidate.');
  }

  await createAuditLog({
    action: 'candidate_created',
    actorId: userId,
    entityId: candidate.id,
    entityType: 'candidate',
    metadata: { email: candidate.email, name: candidate.name },
    organizationId,
  });

  revalidatePath('/recruiter/candidates');

  return candidate;
};
