import { z } from 'zod';

export const shareWithHiringManagerSchema = z.object({
  applicationIds: z.array(z.string().uuid()).min(1),
  channel: z.string().trim().min(1).default('email'),
  contextNote: z.string().trim().optional(),
  managerEmail: z.string().email(),
  managerId: z.string().trim().min(1),
  managerName: z.string().trim().min(1),
});

export const recordMockHiringManagerDecisionSchema = z.object({
  applicationId: z.string().uuid(),
  decision: z.enum(['approve_round_1', 'reject', 'hold']),
  handoffId: z.string().uuid(),
  parserConfidence: z.number().int().min(0).max(100).default(90),
  rawResponse: z.string().trim().optional(),
  reason: z.string().trim().optional(),
});
