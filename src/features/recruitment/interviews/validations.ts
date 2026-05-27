import { z } from 'zod';

export const scheduleInterviewSchema = z.object({
  applicationId: z.string().uuid(),
  interviewerId: z.string().trim().min(1),
  interviewerName: z.string().trim().min(1),
  meetingLink: z.string().url().optional(),
  notes: z.string().trim().optional(),
  scheduledAt: z.coerce.date(),
});

export const updateInterviewStatusSchema = z.object({
  interviewId: z.string().uuid(),
  status: z.enum([
    'unscheduled',
    'scheduled',
    'completed',
    'cancelled',
    'feedback_pending',
  ]),
});

export type ScheduleInterviewInput = z.infer<typeof scheduleInterviewSchema>;
export type UpdateInterviewStatusInput = z.infer<typeof updateInterviewStatusSchema>;
