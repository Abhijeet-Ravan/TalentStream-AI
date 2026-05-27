import { z } from 'zod';

export const submitInterviewFeedbackSchema = z.object({
  applicationId: z.string().uuid(),
  communication: z.number().int().min(1).max(5),
  concerns: z.string().trim().optional(),
  cultureFit: z.number().int().min(1).max(5),
  domainFit: z.number().int().min(1).max(5),
  interviewId: z.string().uuid(),
  nextRoundRecommendation: z.enum(['proceed', 'hold', 'reject']),
  overallRecommendation: z.enum(['strong_hire', 'hire', 'no_hire', 'strong_no_hire']),
  reviewerId: z.string().trim().min(1),
  reviewerName: z.string().trim().min(1),
  strengths: z.string().trim().optional(),
  technicalCompetency: z.number().int().min(1).max(5),
});
