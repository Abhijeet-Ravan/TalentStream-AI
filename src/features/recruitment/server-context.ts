import { auth } from '@clerk/nextjs/server';

export const getRecruitmentContext = async () => {
  const { orgId, userId } = await auth();

  if (!userId) {
    throw new Error('You must be signed in to access recruitment data.');
  }

  if (!orgId) {
    throw new Error('Select an organization to access recruitment data.');
  }

  return {
    organizationId: orgId,
    userId,
  };
};
