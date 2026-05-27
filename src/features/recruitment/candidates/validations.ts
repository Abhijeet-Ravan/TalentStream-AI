import { z } from 'zod';

export const candidateSkillSchema = z.object({
  level: z.enum(['working', 'proficient', 'expert']),
  name: z.string().trim().min(1),
  years: z.number().int().nonnegative(),
});

export const createCandidateSchema = z.object({
  capturedAt: z.coerce.date().optional(),
  duplicateOfCandidateId: z.string().uuid().optional(),
  currentCompany: z.string().trim().min(1),
  currentRole: z.string().trim().min(1),
  email: z.string().email(),
  expectedSalary: z.string().trim().min(1),
  experienceYears: z.number().int().nonnegative(),
  location: z.string().trim().min(1),
  name: z.string().trim().min(1),
  noticePeriod: z.string().trim().min(1),
  openToWork: z.boolean().default(false),
  phone: z.string().trim().min(1),
  recentSignals: z.array(z.string().trim().min(1)).default([]),
  resumeUrl: z.string().url().optional(),
  skills: z.array(candidateSkillSchema).default([]),
  source: z.enum([
    'employee_referral',
    'linkedin',
    'naukri',
    'career_site',
    'agency',
    'walk_in',
    'campus',
    'internal',
  ]),
  sourceConfidence: z.number().int().min(0).max(100).optional(),
  sourceMetadata: z.record(z.string(), z.unknown()).default({}),
  sourceUrl: z.string().url().optional(),
});

export type CreateCandidateInput = z.infer<typeof createCandidateSchema>;
