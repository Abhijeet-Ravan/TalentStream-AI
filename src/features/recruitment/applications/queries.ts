import { and, eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { applicationsSchema } from '@/models/Schema';
import { getRecruitmentContext } from '../server-context';

export const getApplications = async () => {
  const { organizationId } = await getRecruitmentContext();

  return db
    .select()
    .from(applicationsSchema)
    .where(eq(applicationsSchema.organizationId, organizationId));
};

export const getApplicationsByJobId = async (jobId: string) => {
  const { organizationId } = await getRecruitmentContext();

  return db
    .select()
    .from(applicationsSchema)
    .where(and(
      eq(applicationsSchema.organizationId, organizationId),
      eq(applicationsSchema.jobId, jobId),
    ));
};

export const getApplicationsByCandidateId = async (candidateId: string) => {
  const { organizationId } = await getRecruitmentContext();

  return db
    .select()
    .from(applicationsSchema)
    .where(and(
      eq(applicationsSchema.organizationId, organizationId),
      eq(applicationsSchema.candidateId, candidateId),
    ));
};
