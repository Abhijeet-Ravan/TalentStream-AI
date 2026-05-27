import { eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import {
  applicationsSchema,
  candidatesSchema,
  hiringManagerDecisionsSchema,
  hiringManagerHandoffsSchema,
  jobsSchema,
} from '@/models/Schema';
import { getRecruitmentContext } from '../server-context';

export const getHandoffs = async () => {
  const { organizationId } = await getRecruitmentContext();
  const [handoffs, decisions, applications, candidates, jobs] = await Promise.all([
    db.select().from(hiringManagerHandoffsSchema).where(eq(hiringManagerHandoffsSchema.organizationId, organizationId)),
    db.select().from(hiringManagerDecisionsSchema).where(eq(hiringManagerDecisionsSchema.organizationId, organizationId)),
    db.select().from(applicationsSchema).where(eq(applicationsSchema.organizationId, organizationId)),
    db.select().from(candidatesSchema).where(eq(candidatesSchema.organizationId, organizationId)),
    db.select().from(jobsSchema).where(eq(jobsSchema.organizationId, organizationId)),
  ]);

  return {
    applications,
    candidates,
    decisions,
    handoffs,
    jobs,
  };
};
