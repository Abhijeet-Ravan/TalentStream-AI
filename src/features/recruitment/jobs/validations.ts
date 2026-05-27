import type { Department, EmploymentType } from '../types';
import { z } from 'zod';
import { departments } from '../mock-data';

export const employmentTypes = [
  'full_time',
  'contract',
  'consultant',
] satisfies EmploymentType[];

const departmentValues = departments as [Department, ...Department[]];
const employmentTypeValues = employmentTypes as [EmploymentType, ...EmploymentType[]];

const optionalText = z.string().trim().optional();

export const jobFormSchema = z.object({
  avoidIndustries: z.array(z.string().trim().min(1)).optional(),
  department: z.enum(departmentValues),
  description: z.string().trim().min(40, 'Role brief should be at least 40 characters.'),
  education: optionalText,
  employmentType: z.enum(employmentTypeValues),
  experienceMax: z.number().int().nonnegative(),
  experienceMin: z.number().int().nonnegative(),
  location: z.string().trim().min(2, 'Location is required.'),
  noticePeriod: z.string().trim().min(2, 'Notice period is required.'),
  preferredIndustries: z.array(z.string().trim().min(1)).min(1, 'Add at least one preferred industry.'),
  preferredSkills: z.array(z.string().trim().min(1)).min(1, 'Add at least one nice-to-have skill.'),
  reportingManager: optionalText,
  requiredSkills: z.array(z.string().trim().min(1)).min(1, 'Add at least one must-have skill.'),
  responsibilities: z.string().trim().min(40, 'Responsibilities should be at least 40 characters.'),
  salaryMax: z.number().int().positive(),
  salaryMin: z.number().int().positive(),
  subFunction: optionalText,
  title: z.string().trim().min(3, 'Job title is required.'),
}).refine(data => data.experienceMax >= data.experienceMin, {
  message: 'Maximum experience must be greater than or equal to minimum experience.',
  path: ['experienceMax'],
}).refine(data => data.salaryMax >= data.salaryMin, {
  message: 'Maximum CTC must be greater than or equal to minimum CTC.',
  path: ['salaryMax'],
});

export type JobFormPayload = z.infer<typeof jobFormSchema>;
